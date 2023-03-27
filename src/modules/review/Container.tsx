import { Protocol, User } from '@prisma/client'
import {
    getProtocolReviewByReviewer,
    getReviewsByProtocol,
} from '@repositories/review'
import { canAccess, canExecute } from '@utils/scopes'
import { ACCESS, ACTION } from '@utils/zod'
import ReviewCreation from './form'
import ReviewItem from './view/ReviewItem'
import ReviewAssign from './assign'

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
        <aside className="relative mt-1 -mr-4 max-w-md border-l border-gray-200 bg-white sm:-mr-6 2xl:-mr-24">
            <div className="sticky top-4 max-h-screen w-[27rem] overflow-auto bg-white px-4">
                {/* @ts-expect-error Server Component */}
                <ReviewAssign reviews={reviews} protocolId={protocol.id} />

                {canExecute(ACTION.COMMENT, user.role, protocol.state) &&
                review ? (
                    <ReviewCreation review={review} />
                ) : null}

                {canAccess(ACCESS.REVIEWS, user.role) && reviews.length > 0 ? (
                    <ul role="list" className="space-y-3">
                        <h3 className="text-lg font-semibold leading-6 text-gray-900">
                            Revisiones
                        </h3>
                        {reviews.map((r, i) => (
                            <ReviewItem key={i} review={r} />
                        ))}
                    </ul>
                ) : null}
            </div>
        </aside>
    )
}
