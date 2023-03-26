import { Protocol, User } from '@prisma/client'
import { canAccess, canExecute } from '@utils/scopes'
import { ACCESS, ACTION } from '@utils/zod'
import ReviewCreation from './form'
import ReviewsView from './view'

// Component serves as Semaphore for reviews (Assign/Create, AddReview, Visualize)
export default function Reviews({
    protocol,
    user,
}: {
    protocol: Protocol
    user: User
}) {
    return (
        // No tocar margenes o paddings aca!
        <aside className="relative max-w-md border-l border-gray-200 bg-white mt-1 -mr-4 sm:-mr-6 2xl:-mr-24">
            <div className="sticky top-4 max-h-screen overflow-auto bg-white">
                {canExecute(ACTION.COMMENT, user.role, protocol.state) ? (
                    // @ts-expect-error
                    <ReviewCreation id={protocol.id} userId={user.id} />
                ) : null}

                {/* {canAccess(ACCESS.REVIEWS, user.role) ? (
                    // @ts-expect-error
                    <ReviewsView id={protocol.id} />
                ) : null} */}
            </div>
        </aside>
    )
}
