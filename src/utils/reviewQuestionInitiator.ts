import { ReviewType } from '@prisma/client'
import { questions } from 'config/review-questions'

export function getInitialQuestionsByType(type: ReviewType) {
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
