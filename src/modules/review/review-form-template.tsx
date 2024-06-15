import { getProtocolReviewByReviewer } from '@repositories/review'
import ReviewForm from './elements/review-form'

export default async function ReviewFormTemplate({
  protocolId,
  userId,
}: {
  protocolId: string
  userId: string
}) {
  const review = await getProtocolReviewByReviewer(protocolId, userId)
  if (!review) return null
  return (
    <div className="w-full lg:w-[28rem] xl:w-[36rem]">
      <ReviewForm review={review} />
    </div>
  )
}
