import type { Role } from '@prisma/client'
import { ReviewType, ReviewVerdict, State } from '@prisma/client'
import { getReviewsByProtocol } from '@repositories/review'
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
        <div className="w-full lg:w-[28rem] xl:w-[36rem]">
            <h3 className="ml-2 text-lg font-semibold text-gray-900">
                Revisiones
            </h3>
            {reviews.some((r) => r.verdict !== ReviewVerdict.NOT_REVIEWED) ? (
                <ul role="list" className="space-y-3 px-1">
                    {reviewsInState.map((r, i) => (
                        <ReviewItem key={i} review={r} role={role} />
                    ))}
                </ul>
            ) : null}
            {reviewsNotInState.length > 0 && (
                <ul role="list" className="space-y-3 px-1 pt-3">
                    {reviewsNotInState.map((r, i) => (
                        <ReviewItem key={i} review={r} role={role} />
                    ))}
                </ul>
            )}
        </div>
    )
}

export default ReviewList
