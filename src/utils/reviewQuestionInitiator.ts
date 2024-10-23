import type { ReviewQuestion } from '@prisma/client'
import { ReviewType } from '@prisma/client'

export async function getInitialQuestionsByType(
  type: ReviewType,
  questions: ReviewQuestion[],
  newReview?: boolean
) {
  if (newReview) {
    if (type === ReviewType.METHODOLOGICAL) {
      return questions
        .filter((q) => q.type === ReviewType.METHODOLOGICAL && q.active == true)
        .map(({ id }) => {
          return { id, approved: true, comment: '' }
        })
    }
    return questions
      .filter((q) => q.type === 'SCIENTIFIC' && q.active == true)
      .map(({ id }) => {
        return { id, approved: true, comment: '' }
      })
  }
  if (type === ReviewType.METHODOLOGICAL) {
    return questions
      .filter((q) => q.type === ReviewType.METHODOLOGICAL)
      .map(({ id }) => {
        return { id, approved: true, comment: '' }
      })
  }
  return questions
    .filter((q) => q.type === 'SCIENTIFIC')
    .map(({ id }) => {
      return { id, approved: true, comment: '' }
    })
}
