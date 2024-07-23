'use client'
import type { ReviewQuestion, ReviewQuestionType } from '@prisma/client'
import { Check, X } from 'tabler-icons-react'

export default function ReviewQuestionView({
  id,
  approved,
  comment,
  index,
  questions,
}: ReviewQuestionType & { index: number; questions: ReviewQuestion[] }) {
  return (
    <div className="py-1">
      <div className="flex gap-1 text-xs text-gray-600">
        <b>{index + 1}- </b>
        <div className="flex-grow">
          {questions?.find((question) => question.id === id)?.question}
        </div>

        <div>
          {approved ?
            <Check className="h-4 w-4 text-success-600" />
          : <X className="h-4 w-4 text-error-600" />}
        </div>
      </div>
      {comment && (
        <div className="mt-1 rounded-lg bg-yellow-100 py-2 pl-4 text-xs font-light  text-gray-900">
          <h3 className="font-semibold text-gray-500">
            Comentario del evaluador:
          </h3>
          <p className="italic">{comment}</p>
        </div>
      )}
    </div>
  )
}
