import type { State } from '@prisma/client'
import { ReviewType, ReviewVerdict, Role } from '@prisma/client'
import { getReviewsByProtocol } from '@repositories/review'
import { getAllUsersWithoutResearchers } from '@repositories/user'
import EvaluatorsByReviewType from '@utils/dictionaries/ReviewTypesDictionary'
import ReviewAssignSelect from './elements/review-assign-select'
import { UserSearch } from 'tabler-icons-react'
import { Badge } from '@elements/badge'
import { canExecute } from '@utils/scopes'

interface ReviewAssignProps {
    role: Role
    protocolId: string
    protocolState: State
    researcherId: string
}
const ReviewAssignation = async ({
    role,
    protocolId,
    protocolState,
    researcherId,
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

    const methodologicalVerdict = reviews.find(
        (x) => x.type === ReviewType.METHODOLOGICAL
    )?.verdict

    const reviewAssignSelectsData = [
        {
            type: ReviewType.METHODOLOGICAL,
            users: users.filter(
                (u) => u.role === Role.METHODOLOGIST && u.id !== researcherId
            ),
            enabled: canExecute('ASSIGN_TO_METHODOLOGIST', role, protocolState),
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
            enabled:
                canExecute('ASSIGN_TO_SCIENTIFIC', role, protocolState) &&
                (methodologicalVerdict === ReviewVerdict.APPROVED ||
                    methodologicalVerdict ===
                        ReviewVerdict.APPROVED_WITH_CHANGES),
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
            enabled:
                canExecute('ASSIGN_TO_SCIENTIFIC', role, protocolState) &&
                (methodologicalVerdict === ReviewVerdict.APPROVED ||
                    methodologicalVerdict ===
                        ReviewVerdict.APPROVED_WITH_CHANGES),
            review:
                reviews.find(
                    (review) => review.type === ReviewType.SCIENTIFIC_EXTERNAL
                ) ?? null,
        },
        {
            type: ReviewType.SCIENTIFIC_THIRD,
            users: users.filter(
                (u) =>
                    u.role === Role.SCIENTIST &&
                    assignedInternal !== u.id &&
                    assignedExternal !== u.id
            ),
            enabled:
                canExecute('ASSIGN_TO_SCIENTIFIC', role, protocolState) &&
                reviews.filter(
                    (e) =>
                        (e.type === ReviewType.SCIENTIFIC_EXTERNAL ||
                            e.type === ReviewType.SCIENTIFIC_INTERNAL) &&
                        e.verdict !== ReviewVerdict.NOT_REVIEWED
                ).length === 2 &&
                reviews.some((e) => e.verdict === ReviewVerdict.REJECTED),
            review:
                reviews.find(
                    (review) => review.type === ReviewType.SCIENTIFIC_THIRD
                ) ?? null,
        },
    ].filter((r) => r.enabled || r.review)
    // Checks if enabled to assign or re-assign, and if has review, it's data is visible (But not necessarily the action)

    return reviewAssignSelectsData.map((data) => (
        <div key={data.type} className="flex items-baseline gap-4">
            <div className="flex flex-grow items-center gap-2">
                <UserSearch className="h-4 text-gray-600" />
                <div className="min-w-[16rem] font-medium">
                    {data.review?.reviewer.name ?? (
                        <span className="text-sm text-gray-500">-</span>
                    )}
                    <div className="-mt-1.5 ml-px text-xs font-light text-gray-500">
                        {data.review?.reviewer.email ?? (
                            <span className="invisible">-</span>
                        )}
                    </div>
                </div>
                <Badge className="ml-4">
                    {EvaluatorsByReviewType[data.type]}
                </Badge>
            </div>
            {data.enabled && (
                <ReviewAssignSelect
                    {...data}
                    protocolId={protocolId}
                    protocolState={protocolState}
                />
            )}
        </div>
    ))
}

export default ReviewAssignation
