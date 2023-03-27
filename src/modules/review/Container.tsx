import { Protocol, User } from '@prisma/client'
import {
    getProtocolReviewByReviewer,
    getReviewsByProtocol,
} from '@repositories/review'
import { canAccess, canExecute } from '@utils/scopes'
import { ACCESS, ACTION } from '@utils/zod'
import ReviewCreation from './form'
import ReviewItem from './view/ReviewItem'

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
        <aside className="relative max-w-md border-l border-gray-200 bg-white mt-1 -mr-4 sm:-mr-6 2xl:-mr-24">
            <div className="sticky top-4 max-h-screen overflow-auto bg-white">
                {canExecute(ACTION.COMMENT, user.role, protocol.state) &&
                review ? (
                    <ReviewCreation review={review} />
                ) : null}

                {canAccess(ACCESS.REVIEWS, user.role) && reviews.length > 0 ? (
                    <ul role="list" className="px-4 space-y-3 w-[27rem]">
                        <h3 className="text-lg font-semibold leading-6 text-gray-900">
                            Revisiones
                        </h3>
                        {reviews.map((r, i) => (
                            <ReviewItem key={i} review={r} user={user} />
                        ))}
                    </ul>
                ) : null}
            </div>
        </aside>
    )
}
