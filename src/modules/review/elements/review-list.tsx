'use client'
import { Review, ReviewType, Role, State, User } from '@prisma/client'
import ItemContainer from '@review/elements/review-container'
import clsx from 'clsx'
import { useMemo, useState } from 'react'
import { ChevronRight } from 'tabler-icons-react'
import ReviewItem from './review-item'

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
            ) ?? null,
        [reviews, state]
    )
    const reviewsNotInState = useMemo(() => {
        if (state === State.ACCEPTED) return reviews
        return (
            reviews.filter((r) =>
                state === State.METHODOLOGICAL_EVALUATION || State.ACCEPTED
                    ? r.type !== ReviewType.METHODOLOGICAL
                    : state === State.SCIENTIFIC_EVALUATION
                    ? r.type !== ReviewType.SCIENTIFIC_EXTERNAL &&
                      r.type !== ReviewType.SCIENTIFIC_INTERNAL
                    : null
            ) ?? null
        )
    }, [reviews, state])

    if (!reviewsNotInState && !reviewsInState) return null
    if (reviewsInState.length > 0 && !reviewsInState.some((r) => r.data))
        return null
    return (
        <ItemContainer title="Revisiones">
            {reviewsInState.some((r) => r.data) ? (
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
