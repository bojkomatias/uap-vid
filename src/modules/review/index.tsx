import { Protocol, User } from '@prisma/client'
import {
    getProtocolReviewByReviewer,
    getReviewsByProtocol,
} from '@repositories/review'
import { canAccess, canExecute, canExecuteActions } from '@utils/scopes'
import { ACCESS, ACTION } from '@utils/zod'
import ReviewCreation from './form'
import ReviewAssign from './assign'
import ReviewList from './view/ReviewList'

// Component serves as Semaphore for reviews (Assign/Create, AddReview, Visualize)
export default async function Reviews({
    protocol,
    user,
}: {
    protocol: Protocol
    user: User
}) {
    const review = await getProtocolReviewByReviewer(protocol.id, user.id)
    const reviews = await getReviewsByProtocol(protocol.id)
    return (
        // No tocar margenes o paddings aca!
        <aside className="relative">
            <div className="sticky top-4 mb-4 space-y-3">
                {canExecuteActions(
                    [
                        ACTION.ASSIGN_TO_METHODOLOGIST,
                        ACTION.ASSIGN_TO_SCIENTIFIC,
                        ACTION.ACCEPT,
                    ],
                    user.role,
                    protocol.state
                ) ? (
                    //  @ts-expect-error Server Component
                    <ReviewAssign
                        reviews={reviews}
                        protocolId={protocol.id}
                        protocolState={protocol.state}
                    />
                ) : null}

                {canExecute(ACTION.COMMENT, user.role, protocol.state) &&
                review ? (
                    <ReviewCreation review={review} />
                ) : null}

                {canAccess(ACCESS.REVIEWS, user.role) && reviews.length > 0 ? (
                    <ReviewList
                        reviews={reviews}
                        user={user}
                        state={protocol.state}
                    />
                ) : null}
            </div>
        </aside>
    )
}
