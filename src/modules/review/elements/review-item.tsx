'use client'
import type { Review, User } from '@prisma/client'
import { ReviewVerdict, Role } from '@prisma/client'
import ReviewTypesDictionary from '@utils/dictionaries/ReviewTypesDictionary'
import { cx } from '@utils/cx'
import { useCallback, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { relativeTimeFormatter } from '@utils/formatters'
import ReviewQuestionView from './review-question-view'
import { ChevronRight } from 'tabler-icons-react'
import ReviewVerdictBadge from './review-verdict-badge'
import { emailer } from '@utils/emailer'
import { markRevised } from '@repositories/review'
import { useCases } from '@utils/emailer/use-cases'

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
    if (review.verdict === 'NOT_REVIEWED') return null
    return (
        <li>
            <div className="min-w-0 flex-1">
                <dt className="label">{ReviewTypesDictionary[review.type]}</dt>
                <div
                    className={cx(
                        'rounded border',
                        review.revised
                            ? 'bg-gray-50 opacity-70'
                            : 'bg-white opacity-100'
                    )}
                >
                    <button
                        className="group -mb-px flex w-full items-center justify-between space-x-4 rounded-t bg-gray-100 px-2 py-1 text-gray-500"
                        onClick={() => setShowReviewQuestions((prv) => !prv)}
                    >
                        <ReviewVerdictBadge verdict={review.verdict} />

                        {review.verdict ===
                        ReviewVerdict.APPROVED_WITH_CHANGES ? (
                            isOwner ? (
                                <ReviseCheckbox
                                    id={review.id}
                                    revised={review.revised}
                                />
                            ) : (
                                <label className="label pointer-events-auto">
                                    {review.revised
                                        ? 'revisado'
                                        : 'no revisado'}
                                </label>
                            )
                        ) : null}
                        <span className="flex text-xs font-semibold text-gray-600 group-hover:underline">
                            Ver detalles
                            <ChevronRight
                                className={cx(
                                    'h-4 w-4 transition',
                                    showReviewQuestions && 'rotate-90'
                                )}
                            />
                        </span>
                    </button>

                    {showReviewQuestions && (
                        <div className="space-y-4 py-4 pl-2 pr-4">
                            {review.questions.map((question, index) => (
                                <ReviewQuestionView
                                    key={question.id}
                                    index={index}
                                    {...question}
                                />
                            ))}
                        </div>
                    )}

                    <div className="-mt-px flex justify-end gap-1 px-3 py-0.5 text-xs">
                        <span className="font-semibold text-gray-700">
                            {role === Role.ADMIN || role === Role.SECRETARY
                                ? review.reviewer.name
                                : null}
                        </span>
                        <span className="font-light text-gray-500">
                            {getDuration(
                                new Date().getTime() -
                                    new Date(review.updatedAt).getTime()
                            )}
                        </span>
                    </div>
                </div>
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

            <label
                htmlFor={`revised-${id}`}
                className="label pointer-events-auto"
            >
                revisado
            </label>
        </span>
    )
}
