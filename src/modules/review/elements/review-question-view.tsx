import type { ReviewQuestion } from '@prisma/client'
import { questions } from 'config/review-questions'
import { Check, X } from 'tabler-icons-react'

export default function ReviewQuestionView({
    id,
    approved,
    comment,
}: ReviewQuestion) {
    return (
        <div className="p-3">
            <div className="flex justify-between gap-1 text-xs font-semibold text-gray-600">
                {questions.find((question) => question.id === id)?.question}
                <div>
                    {approved ? (
                        <Check className="h-5 w-5 text-success-600" />
                    ) : (
                        <X className="h-5 w-5 text-error-600" />
                    )}
                </div>
            </div>
            <div className="mt-1 pl-2 text-xs font-medium text-gray-500">
                {comment}
            </div>
        </div>
    )
}
