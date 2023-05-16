import { ReviewType, ReviewVerdict, Role, State } from '@prisma/client'
import { getReviewsByProtocol } from '@repositories/review'
import { getAllUsersWithoutResearchers } from '@repositories/user'
import ItemContainer from '@review/elements/review-container'
import EvaluatorsByReviewType from '@utils/dictionaries/ReviewTypesDictionary'
import ReviewAssignSelect from './elements/review-assign-select'

interface ReviewAssignProps {
    protocolId: string
    protocolState: State
}
const ReviewAssignation = async ({
    protocolId,
    protocolState,
}: ReviewAssignProps) => {
    const reviews = await getReviewsByProtocol(protocolId)
    const users = await getAllUsersWithoutResearchers()
    if (!users) return null

    const assignedInternal = reviews.find(
        (r) => r.type === 'SCIENTIFIC_INTERNAL'
    )?.reviewerId
    const assignedExternal = reviews.find(
        (r) => r.type === 'SCIENTIFIC_EXTERNAL'
    )?.reviewerId

    const reviewAssignSelectsData = [
        {
            type: ReviewType.METHODOLOGICAL,
            users: users.filter((u) => u.role === Role.METHODOLOGIST),
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
            users: users.filter(
                (u) => u.role === Role.SCIENTIST && assignedExternal !== u.id
            ),
            protocolId: protocolId,
            enabled:
                (protocolState === State.METHODOLOGICAL_EVALUATION &&
                    reviews.find((x) => x.type === ReviewType.METHODOLOGICAL)
                        ?.verdict === ReviewVerdict.APPROVED) ||
                reviews.find((x) => x.type === ReviewType.METHODOLOGICAL)
                    ?.verdict === ReviewVerdict.APPROVED_WITH_CHANGES ||
                protocolState === State.SCIENTIFIC_EVALUATION,
            review:
                reviews.find(
                    (review) => review.type === ReviewType.SCIENTIFIC_INTERNAL
                ) ?? null,
        },
        {
            type: ReviewType.SCIENTIFIC_EXTERNAL,
            users: users.filter(
                (u) => u.role === Role.SCIENTIST && assignedInternal !== u.id
            ),
            protocolId: protocolId,
            enabled:
                (protocolState === State.METHODOLOGICAL_EVALUATION &&
                    reviews.find((x) => x.type === ReviewType.METHODOLOGICAL)
                        ?.verdict === ReviewVerdict.APPROVED) ||
                reviews.find((x) => x.type === ReviewType.METHODOLOGICAL)
                    ?.verdict === ReviewVerdict.APPROVED_WITH_CHANGES ||
                protocolState === State.SCIENTIFIC_EVALUATION,
            review:
                reviews.find(
                    (review) => review.type === ReviewType.SCIENTIFIC_EXTERNAL
                ) ?? null,
        },
    ].filter((r) => r.enabled)

    return (
        <ItemContainer title="Evaluadores">
            {reviewAssignSelectsData.map((data) => (
                <div key={data.type} className="mb-4 px-2">
                    <label className="label">
                        {EvaluatorsByReviewType[data.type]}
                    </label>
                    <ReviewAssignSelect {...data} />
                </div>
            ))}
        </ItemContainer>
    )
}

export default ReviewAssignation
