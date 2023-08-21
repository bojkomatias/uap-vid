import type { Role, State } from '@prisma/client'
import { canAccess, canExecute } from '@utils/scopes'
import { ACCESS, ACTION } from '@utils/zod'
import ReviewList from './elements/review-list'
import ReviewFormTemplate from './review-form-template'

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
        <aside className="w-full space-y-3 overflow-y-auto py-3 pl-4 pr-1 lg:sticky lg:right-0 lg:top-0 lg:h-screen lg:max-w-md lg:pl-0 xl:max-w-xl">
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
