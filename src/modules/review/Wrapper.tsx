import { protocol, user } from '@prisma/client'
import ReviewForm from './form'
import ReadComment from './view/ReadComment'

export default function ReviewWrapper({
    protocol,
    user,
}: {
    protocol: protocol
    user: user
}) {
    // *If no protocols no show
    // TODO: Some roles should have access to their own reviews. And according to the protocol State...
    if (!protocol?.reviews) return <></>
    return (
        <aside className="relative px-5 max-w-md w-full flex-shrink-0 overflow-y-auto border-l border-gray-200 ">
            <ReviewForm reviewer={user} protocol={protocol} />
            <ReadComment comments={protocol.reviews.methodologic.comments} />
        </aside>
    )
}
