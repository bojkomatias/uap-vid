import { Protocol, Review, User } from '@prisma/client'
import ReviewForm from './form'
import ReadComment from './view/ReadComment'

export default function ReviewWrapper({
    protocol,
    user,
}: {
    protocol: Protocol & { reviews: Review[] }
    user: User
}) {
    // *If no protocols no show
    // TODO: Some roles should have access to their own reviews. And according to the protocol State...

    if (protocol.reviews.length === 0) return <></>
    return (
        // No tocar margenes o paddings aca!
        <aside className="relative max-w-md w-full border-l border-gray-200 -mr-4 sm:-mr-6 2xl:-mr-24">
            <div className="sticky top-4 max-h-screen overflow-auto">
                <ReviewForm reviewer={user} protocolState={protocol.state} />
                <ReadComment comments={protocol.reviews[0].comments} />
            </div>
        </aside>
    )
}
