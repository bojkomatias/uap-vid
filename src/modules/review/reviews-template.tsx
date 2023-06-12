import type { Role, State } from '@prisma/client'
import { canAccess, canExecute, canExecuteActions } from '@utils/scopes'
import { ACCESS, ACTION } from '@utils/zod'
import ReviewList from './elements/review-list'
import ReviewAssignation from './review-assignation'
import ReviewFormTemplate from './review-form-template'
import ReviewAssignationWrapper from './review-assignation-wrapper'

// Component serves as Semaphore for reviews (Assign/Create, AddReview, Visualize)
export default async function ReviewsTemplate({
    id,
    researcherId,
    state,
    userId,
    userRole,
}: {
    id: string
    researcherId: string
    state: State
    userId: string
    userRole: Role
}) {
    return (
        <aside className="relative">
            <div className="sticky top-4 mb-4 space-y-3">
                {canExecuteActions(
                    userId === researcherId
                        ? []
                        : [
                              ACTION.ASSIGN_TO_METHODOLOGIST,
                              ACTION.ASSIGN_TO_SCIENTIFIC,
                              ACTION.ACCEPT,
                          ],
                    userRole,
                    state
                ) && (
                    <ReviewAssignationWrapper>
                        {/* @ts-expect-error Server Component */}
                        <ReviewAssignation
                            protocolId={id}
                            protocolState={state}
                        />
                    </ReviewAssignationWrapper>
                )}

                {userId !== researcherId &&
                    canExecute(ACTION.COMMENT, userRole, state) && (
                        // @ts-expect-error
                        <ReviewFormTemplate protocolId={id} userId={userId} />
                    )}

                {userId === researcherId ||
                    (canAccess(ACCESS.REVIEWS, userRole) && (
                        // @ts-expect-error
                        <ReviewList role={userRole} state={state} id={id} />
                    ))}
            </div>
        </aside>
    )
}
