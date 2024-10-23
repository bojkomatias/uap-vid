import { getProtocolReviewByReviewer } from '@repositories/review'
import ReviewForm from './elements/review-form'
import { getAllQuestions } from '@repositories/review-question'

export async function ReviewFormTemplate({
  protocolId,
  userId,
}: {
  protocolId: string
  userId: string
}) {
  const review = await getProtocolReviewByReviewer(protocolId, userId)
  const questions = await getAllQuestions()

  if (!review) return null
  return <ReviewForm review={review} questions={questions} />
}
