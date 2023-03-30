'use client'
import { Review, ReviewType, Role, State, User } from '@prisma/client'
import ItemContainer from '@review/ItemContainer'
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

    if (!reviewsInState[0].data && !reviewsNotInState) return null
    return (
        <ItemContainer title="Revisiones">
            {reviewsInState[0].data ? (
                <ul role="list" className="space-y-3">
                    {reviewsInState.map((r, i) => (
                        <ReviewItem key={i} review={r} user={user} />
                    ))}
                </ul>
            ) : null}
            {(user.role === Role.ADMIN || Role.SECRETARY) &&
            reviewsNotInState.length > 0 ? (
                <>
                    <button
                        onClick={() => setShowHistorical((prv) => !prv)}
                        className="flex cursor-pointer items-center gap-3 focus:outline-0"
                    >
                        <span className="text-sm font-semibold leading-10 text-gray-700">
                            Revisiones históricas
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
        </ItemContainer>
    )
}

export default ReviewList
