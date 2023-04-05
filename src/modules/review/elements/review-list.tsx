import { ReviewType, Role, State } from '@prisma/client'
import { getReviewsByProtocol } from '@repositories/review'
import ItemContainer from '@review/elements/review-container'
import { HistoricalReviewList } from './historical-review-list'
import ReviewItem from './review-item'

type ReviewStateProps = {
    id: string
    role: Role
    state: State
}
async function ReviewList({ id, role, state }: ReviewStateProps) {
    const reviews = await getReviewsByProtocol(id)

    const reviewsInState = reviews.filter((r) =>
        state === State.METHODOLOGICAL_EVALUATION
            ? r.type === ReviewType.METHODOLOGICAL
            : state === State.SCIENTIFIC_EVALUATION
            ? r.type === ReviewType.SCIENTIFIC_EXTERNAL ||
              r.type == ReviewType.SCIENTIFIC_INTERNAL
            : null
    )

    const reviewsNotInState =
        state === State.ACCEPTED
            ? reviews
            : reviews.filter((r) =>
                  state === State.SCIENTIFIC_EVALUATION
                      ? r.type === ReviewType.METHODOLOGICAL
                      : null
              )

    if (!reviewsNotInState && !reviewsInState) return null
    if (reviewsInState.length > 0 && !reviewsInState.some((r) => r.data))
        return null

    return (
        <ItemContainer title="Revisiones">
            {reviewsInState.some((r) => r.data) ? (
                <ul role="list" className="space-y-3">
                    {reviewsInState.map((r, i) => (
                        <ReviewItem key={i} review={r} role={role} />
                    ))}
                </ul>
            ) : null}
            {(role === Role.ADMIN || Role.SECRETARY) && (
                <HistoricalReviewList reviews={reviewsNotInState} role={role} />
            )}
        </ItemContainer>
    )
}

export default ReviewList
