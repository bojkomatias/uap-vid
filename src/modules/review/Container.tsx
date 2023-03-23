import { Protocol, Review, User } from '@prisma/client'
import ReviewCreation from './form'
import ReviewForm from './form/Form'
import ReviewView from './view'
import ReadComment from './view/Comment'

export default function Reviews({
    protocol,
    user,
}: {
    protocol: Protocol & { reviews: Review[] }
    user: User
}) {
    // *If no protocols no show
    // TODO: Some roles should have access to their own reviews. And according to the protocol State...
    console.log(protocol.reviews)
    return (
        // No tocar margenes o paddings aca!
        <aside className="relative max-w-md border-l border-gray-200 -mr-4 sm:-mr-6 2xl:-mr-24">
            <div className="sticky top-4 max-h-screen overflow-auto">
                <ReviewCreation
                    reviewer={user}
                    protocolState={protocol.state}
                />
                <ReviewView user={user} reviews={protocol.reviews} />
            </div>
        </aside>
    )
}
