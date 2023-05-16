'use client'
import type { Review, User } from '@prisma/client'
import { ReviewVerdict, Role } from '@prisma/client'
import ReviewVerdictsDictionary from '@utils/dictionaries/ReviewVerdictsDictionary'
import ReviewTypesDictionary from '@utils/dictionaries/ReviewTypesDictionary'
import clsx from 'clsx'
import { useCallback, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { relativeTimeFormatter } from '@utils/formatters'
import ReviewQuestionView from './review-question-view'
import { ChevronRight } from 'tabler-icons-react'

export default function ReviewItem({
    review,
    role,
}: {
    review: Review & { reviewer: User }
    role: Role
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

    return (
        <li>
            <div className="min-w-0 flex-1">
                <dt className="label">{ReviewTypesDictionary[review.type]}</dt>
                <div
                    className={clsx('rounded border', {
                        'bg-gray-50 opacity-70': review.revised,
                        'bg-white opacity-100': !review.revised,
                    })}
                >
                    <button
                        className="-mb-px flex w-full items-center justify-between space-x-4 rounded-t bg-gray-100 px-2 py-1 text-gray-500"
                        onClick={() => setShowReviewQuestions((prv) => !prv)}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-light text-gray-600">
                                Veredicto:
                            </span>
                            <span
                                className={clsx(
                                    'flex items-center gap-1 rounded bg-white px-2 py-px text-xs font-light uppercase',
                                    {
                                        'ring-1 ring-warning-500/50':
                                            review.verdict ===
                                            ReviewVerdict.APPROVED_WITH_CHANGES,
                                        'ring-1 ring-success-500/50':
                                            review.verdict ===
                                            ReviewVerdict.APPROVED,
                                        'ring-1 ring-error-500/50':
                                            review.verdict ===
                                            ReviewVerdict.REJECTED,
                                    }
                                )}
                            >
                                {ReviewVerdictsDictionary[review.verdict]}
                                <div
                                    className={clsx('h-2 w-2 rounded', {
                                        'bg-warning-500 ':
                                            review.verdict ===
                                            ReviewVerdict.APPROVED_WITH_CHANGES,
                                        'bg-success-600':
                                            review.verdict ===
                                            ReviewVerdict.APPROVED,
                                        'bg-error-600':
                                            review.verdict ===
                                            ReviewVerdict.REJECTED,
                                    })}
                                />
                            </span>
                        </div>

                        {review.verdict ===
                        ReviewVerdict.APPROVED_WITH_CHANGES ? (
                            role === Role.RESEARCHER ? (
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
                        <ChevronRight
                            className={clsx('h-4 w-4 transition', {
                                'rotate-90': showReviewQuestions,
                            })}
                        />
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
                            {role === Role.ADMIN || Role.SECRETARY
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
            await fetch(`/api/review/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(revised),
            })
            startTransition(() => {
                router.refresh()
            })
        },
        [id, router]
    )

    return (
        <span>
            <input
                disabled={isPending}
                id={`revised-${id}`}
                name={`revised-${id}`}
                type="checkbox"
                defaultChecked={revised}
                className="mb-0.5 mr-1 h-3.5 w-3.5 rounded-md border-gray-300 text-primary focus:ring-primary"
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
