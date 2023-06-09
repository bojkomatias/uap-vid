import { ReviewType, ReviewVerdict, Role, State } from '@prisma/client'
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

    if (
        !reviews ||
        state === State.DRAFT ||
        state === State.PUBLISHED ||
        !reviews.some((r) => r.verdict !== ReviewVerdict.NOT_REVIEWED)
    )
        return null

    const reviewsInState = reviews.filter((r) =>
        state === State.METHODOLOGICAL_EVALUATION
            ? r.type === ReviewType.METHODOLOGICAL
            : state === State.SCIENTIFIC_EVALUATION
            ? r.type === ReviewType.SCIENTIFIC_EXTERNAL ||
              r.type == ReviewType.SCIENTIFIC_INTERNAL ||
              r.type == ReviewType.SCIENTIFIC_THIRD
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

    return (
        <ItemContainer
            title="Revisiones"
            fit={role === Role.ADMIN || role === Role.SECRETARY}
        >
            {reviewsInState.some(
                (r) => r.verdict !== ReviewVerdict.NOT_REVIEWED
            ) ? (
                <ul role="list" className="space-y-3 px-1">
                    {reviewsInState.map((r, i) => (
                        <ReviewItem key={i} review={r} role={role} />
                    ))}
                </ul>
            ) : null}
            {reviewsNotInState.length > 0 &&
                (role === Role.ADMIN || Role.SECRETARY) && (
                    <HistoricalReviewList
                        reviews={reviewsNotInState}
                        role={role}
                    />
                )}
        </ItemContainer>
    )
}

export default ReviewList
