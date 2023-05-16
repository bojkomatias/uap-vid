import type { ReviewQuestion } from '@prisma/client'
import { questions } from 'config/review-questions'
import { Check, X } from 'tabler-icons-react'

export default function ReviewQuestionView({
    id,
    approved,
    comment,
    index,
}: ReviewQuestion & { index: number }) {
    return (
        <div>
            <div className="flex justify-between gap-1 text-xs text-gray-600">
                <b>{index + 1}- </b>
                {questions.find((question) => question.id === id)?.question}
                <div>
                    {approved ? (
                        <Check className="h-5 w-5 text-success-600" />
                    ) : (
                        <X className="h-5 w-5 text-error-600" />
                    )}
                </div>
            </div>
            <div className="mt-1 pl-4 text-xs font-light text-gray-900">
                {comment}
            </div>
        </div>
    )
}
