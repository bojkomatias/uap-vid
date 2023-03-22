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
        <aside className="relative px-5 max-w-md w-full flex-shrink-0 overflow-y-auto border-l border-gray-200">
            <ReviewForm reviewer={user} protocolState={protocol.state} />
            <ReadComment comments={protocol.reviews[0].comments} />
        </aside>
    )
}
