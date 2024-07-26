'use client'
import type { Review, ReviewQuestion, User } from '@prisma/client'
import { ReviewVerdict, Role } from '@prisma/client'
import ReviewTypesDictionary from '@utils/dictionaries/ReviewTypesDictionary'
import { cx } from '@utils/cx'
import { useCallback, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { relativeTimeFormatter } from '@utils/formatters'
import ReviewQuestionView from './review-question-view'
import { ChevronRight, Loader } from 'tabler-icons-react'
import ReviewVerdictBadge from './review-verdict-badge'
import { emailer } from '@utils/emailer'
import { markRevised } from '@repositories/review'
import { useCases } from '@utils/emailer/use-cases'
import { useQuery } from '@tanstack/react-query'
import { getAllQuestions } from '@repositories/review-question'
import { Subheading } from '@components/heading'
import { BadgeButton } from '@components/badge'
import { Text } from '@components/text'

export default function ReviewItem({
  review,
  role,
  isOwner,
}: {
  review: Review & { reviewer: User }
  role: Role
  isOwner: boolean
}) {
  function getDuration(milliseconds: number) {
    const minutes = Math.floor(milliseconds / 60000)
    const hours = Math.round(minutes / 60)
    const days = Math.round(hours / 24)

    return (
      (days && relativeTimeFormatter.format(-days, 'day')) ||
      (hours && relativeTimeFormatter.format(-hours, 'hour')) ||
      (minutes && relativeTimeFormatter.format(-minutes, 'minute'))
    )
  }
  const [showReviewQuestions, setShowReviewQuestions] = useState(false)

  const { isLoading, data } = useQuery<ReviewQuestion[]>({
    queryKey: ['questions', review],
    queryFn: async () => await getAllQuestions(),
  })

  if (review.verdict === ReviewVerdict.NOT_REVIEWED) return null

  return (
    <li className="pr-px">
      <Subheading className="flex justify-between">
        {ReviewTypesDictionary[review.type]}
        <ReviewVerdictBadge verdict={review.verdict} />
      </Subheading>
      <div className="mt-1 flex justify-between">
        {review.verdict === ReviewVerdict.APPROVED_WITH_CHANGES ?
          isOwner ?
            <ReviseCheckbox id={review.id} revised={review.revised} />
          : <Text>{review.revised ? 'Revisado' : 'No revisado'}</Text>
        : null}
        <BadgeButton onClick={() => setShowReviewQuestions((prv) => !prv)}>
          Ver evaluación
          <ChevronRight
            data-slot="icon"
            className={cx('size-4', showReviewQuestions ? 'rotate-90' : '')}
          />
        </BadgeButton>
      </div>
      {showReviewQuestions && data && (
        <div className="space-y-2">
          {isLoading ?
            <Loader />
          : review.questions.map((question, index) => (
              <ReviewQuestionView
                key={question.id}
                index={index}
                questions={data}
                approved={question.approved}
                comment={question.comment}
                id={question.id}
              />
            ))
          }
        </div>
      )}

      <div className="-mt-px flex justify-end gap-1 px-3 py-0.5 text-xs">
        <span className="font-semibold text-gray-700">
          {role === Role.ADMIN || role === Role.SECRETARY ?
            review.reviewer.name
          : null}
        </span>
        <span className="font-light text-gray-500">
          {new Date().getTime() - new Date(review.updatedAt).getTime() > 1 ?
            getDuration(
              new Date().getTime() - new Date(review.updatedAt).getTime()
            )
          : 'hace un instante'}
        </span>
      </div>
    </li>
  )
}

const ReviseCheckbox = ({ id, revised }: { id: string; revised: boolean }) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const updateRevised = useCallback(
    async (revised: boolean) => {
      const review = await markRevised(id, revised)
      if (review) {
        emailer({
          useCase: useCases.onRevised,
          email: review.reviewer.email,
          protocolId: review.protocolId,
        })
        startTransition(() => {
          router.refresh()
        })
      }
    },
    [id, router]
  )

  return (
    <span>
      <input
        disabled={isPending || revised}
        id={`revised-${id}`}
        name={`revised-${id}`}
        type="checkbox"
        defaultChecked={revised}
        className="mb-0.5 mr-1 h-3.5 w-3.5 rounded-md  text-primary focus:ring-primary"
        onChange={(e) => updateRevised(e.target.checked)}
      />

      <label htmlFor={`revised-${id}`} className="label pointer-events-auto">
        revisado
      </label>
    </span>
  )
}
