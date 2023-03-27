import { Review, ReviewType, ReviewVerdict, State } from '@prisma/client'
import { getAllUsersWithoutResearchers } from '@repositories/users'
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
        <div className="mb-8">
            <h3 className="mb-4 text-lg font-semibold leading-6 text-gray-900">
                Evaluadores asignados
            </h3>
            {reviewAssignSelectsData.map((data) => (
                <div key={data.type} className="mb-4">
                    <h2>{EvaluatorsByReviewType[data.type]}</h2>
                    <ReviewAssignSelect {...data} />
                </div>
            ))}
        </div>
    )
}

export default ReviewAssign
