import type { Role } from '@prisma/client'
import { Access, Action, ProtocolState } from '@prisma/client'
import { canAccess, canExecute } from '@utils/scopes'
import ReviewList from './elements/review-list'
import ReviewFormTemplate from './review-form-template'
import { cx } from '@utils/cx'

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
    state: ProtocolState
    userId: string
    userRole: Role
}) {
    return (
        <aside
            className={cx(
                'min-w-fit space-y-3 overflow-y-auto py-3 pl-4 pr-1 lg:sticky lg:top-0 lg:h-screen lg:pl-0',
                (state === ProtocolState.DRAFT ||
                    state === ProtocolState.PUBLISHED) &&
                    'hidden'
            )}
        >
            {userId !== researcherId &&
            canExecute(Action.REVIEW, userRole, state) ? (
                <ReviewFormTemplate protocolId={id} userId={userId} />
            ) : null}

            {userId === researcherId || canAccess(Access.REVIEWS, userRole) ? (
                <ReviewList
                    role={userRole}
                    id={id}
                    isOwner={userId === researcherId}
                />
            ) : null}
        </aside>
    )
}
