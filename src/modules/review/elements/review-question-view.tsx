'use client'
import { Strong, Text } from '@components/text'
import type { ReviewQuestion, ReviewQuestionType } from '@prisma/client'
import { Check, X } from 'tabler-icons-react'

export default function ReviewQuestionView({
  id,
  approved,
  comment,
  index,
  questions,
}: ReviewQuestionType & { index: number; questions: ReviewQuestion[] }) {
  console.log('--->', id, questions)
  return (
    <div>
      <Strong className="inline text-xs/6">
        {index + 1}-{' '}
        {approved ?
          <Check className="inline size-4 text-success-500/80" />
        : <X className="inline size-4 text-error-500/80" />}
      </Strong>

      <Text>{questions.find((question) => question.id == id)?.question}</Text>

      {comment && (
        <div className="mt-1 rounded-lg bg-yellow-500/10 py-2 pl-4">
          <Strong>Comentario del evaluador:</Strong>
          <Text>{comment}</Text>
        </div>
      )}
    </div>
  )
}
