import { getProtocolReviewByReviewer } from '@repositories/review'
import ReviewForm from './Form'

// * Component acts as guard clause before rendering form.
export default async function ReviewCreation({
    id,
    userId,
}: {
    id: string
    userId: string
}) {
    const review = await getProtocolReviewByReviewer(id, userId)
    if (!review) return <></>
    return <ReviewForm review={review} />
}
