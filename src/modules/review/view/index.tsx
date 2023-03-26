import { getReviewsByProtocol } from '@repositories/review'
import ReviewItem from './ReviewItem'

export default async function ReviewsView({ id }: { id: string }) {
    const reviews = await getReviewsByProtocol(id)
    if (reviews.length === 0) return <></>
    return (
        <ul role="list" className="px-4 space-y-3 w-[27rem]">
            <h3 className="text-lg font-semibold leading-6 text-gray-900">
                Revisiones
            </h3>
            {reviews.map((r, i) => (
                <ReviewItem key={i} review={r} />
            ))}
        </ul>
    )
}
