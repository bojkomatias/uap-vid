'use client'
import { Review, ReviewType, Role, State, User } from '@prisma/client'
import clsx from 'clsx'
import { useMemo, useState } from 'react'
import { ChevronRight } from 'tabler-icons-react'
import ReviewItem from './ReviewItem'

type ReviewStateProps = {
    reviews: (Review & { reviewer: User })[]
    user: User
    state: State
}
function ReviewList({ reviews, user, state }: ReviewStateProps) {
    const [showHistorical, setShowHistorical] = useState(false)
    const reviewsInState = useMemo(
        () =>
            reviews.filter((r) =>
                state === State.METHODOLOGICAL_EVALUATION
                    ? r.type === ReviewType.METHODOLOGICAL
                    : state === State.SCIENTIFIC_EVALUATION
                    ? r.type === ReviewType.SCIENTIFIC_EXTERNAL ||
                      r.type == ReviewType.SCIENTIFIC_INTERNAL
                    : null
            ),
        [reviews, state]
    )
    const reviewsNotInState = useMemo(
        () =>
            reviews.filter((r) =>
                state === State.METHODOLOGICAL_EVALUATION
                    ? r.type !== ReviewType.METHODOLOGICAL
                    : state === State.SCIENTIFIC_EVALUATION
                    ? r.type !== ReviewType.SCIENTIFIC_EXTERNAL &&
                      r.type !== ReviewType.SCIENTIFIC_INTERNAL
                    : null
            ),
        [reviews, state]
    )

    return (
        <div className="w-[27rem] px-4">
            <h3 className="text-lg font-semibold leading-10 text-gray-900">
                Revisiones
            </h3>
            <ul role="list" className="space-y-3">
                {reviewsInState.map((r, i) => (
                    <ReviewItem key={i} review={r} user={user} />
                ))}
            </ul>
            {user.role === Role.ADMIN || Role.SECRETARY ? (
                <>
                    <button
                        onClick={() => setShowHistorical((prv) => !prv)}
                        className="mt-8 flex cursor-pointer items-center gap-3 focus:outline-0"
                    >
                        <span className="text-sm font-semibold leading-10 text-gray-700">
                            Revisiones históricas{' '}
                        </span>
                        <ChevronRight
                            className={clsx('h-4 w-4 transition', {
                                'rotate-90': showHistorical,
                            })}
                        />
                    </button>
                    <ul role="list" className="space-y-3">
                        {showHistorical &&
                            reviewsNotInState.map((r, i) => (
                                <ReviewItem key={i} review={r} user={user} />
                            ))}
                    </ul>
                </>
            ) : null}
        </div>
    )
}

export default ReviewList
