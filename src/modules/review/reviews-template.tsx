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
        <aside className="sticky top-4 mb-4 h-fit space-y-3">
            {userId !== researcherId &&
                canExecute(ACTION.COMMENT, userRole, state) && (
                    <ReviewFormTemplate protocolId={id} userId={userId} />
                )}
            {userId === researcherId ||
                (canAccess(ACCESS.REVIEWS, userRole) && (
                    <ReviewList role={userRole} state={state} id={id} />
                ))}
        </aside>
    )
}
