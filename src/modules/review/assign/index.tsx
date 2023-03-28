import { Review, ReviewType, ReviewVerdict, State } from '@prisma/client'
import { getAllUsersWithoutResearchers } from '@repositories/users'
import ItemContainer from '@review/ItemContainer'
import EvaluatorsByReviewType from '@utils/dictionaries/ReviewTypesDictionary'
import ReviewAssignSelect from './ReviewAssignSelect'

interface ReviewAssignProps {
    reviews: Review[]
    protocolId: string
    protocolState: State
}
const ReviewAssign = async ({
    reviews,
    protocolId,
    protocolState,
}: ReviewAssignProps) => {
    const users = await getAllUsersWithoutResearchers()
    const reviewAssignSelectsData = [
        {
            type: ReviewType.METHODOLOGICAL,
            users: users ?? [], //here we can filter users by role later
            protocolId: protocolId,
            enabled:
                protocolState === State.PUBLISHED ||
                protocolState === State.METHODOLOGICAL_EVALUATION,
            review:
                reviews.find(
                    (review) => review.type === ReviewType.METHODOLOGICAL
                ) ?? null,
        },
        {
            type: ReviewType.SCIENTIFIC_INTERNAL,
            users: users ?? [], //here we can filter users by role later
            protocolId: protocolId,
            enabled:
                (protocolState === State.METHODOLOGICAL_EVALUATION &&
                    reviews.find((x) => x.type === ReviewType.METHODOLOGICAL)
                        ?.verdict === ReviewVerdict.APPROVED) ||
                protocolState === State.SCIENTIFIC_EVALUATION,
            review:
                reviews.find(
                    (review) => review.type === ReviewType.SCIENTIFIC_INTERNAL
                ) ?? null,
        },
        {
            type: ReviewType.SCIENTIFIC_EXTERNAL,
            users: users ?? [], //here we can filter users by role later
            protocolId: protocolId,
            enabled:
                (protocolState === State.METHODOLOGICAL_EVALUATION &&
                    reviews.find((x) => x.type === ReviewType.METHODOLOGICAL)
                        ?.verdict === ReviewVerdict.APPROVED) ||
                protocolState === State.SCIENTIFIC_EVALUATION,
            review:
                reviews.find(
                    (review) => review.type === ReviewType.SCIENTIFIC_EXTERNAL
                ) ?? null,
        },
    ]
    return (
        <ItemContainer title="Evaluadores">
            {reviewAssignSelectsData
                .filter((r) => r.enabled)
                .map((data) => (
                    <div key={data.type} className="mb-4">
                        <label className="label">
                            {EvaluatorsByReviewType[data.type]}
                        </label>
                        <ReviewAssignSelect {...data} />
                    </div>
                ))}
        </ItemContainer>
    )
}

export default ReviewAssign
