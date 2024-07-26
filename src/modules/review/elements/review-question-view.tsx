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
      <div className="flex items-start">
        <Strong className="pr-0.5 text-sm/6">{index + 1}) </Strong>
        <Text className="grow">
          {questions.find((question) => question.id == id)?.question}
        </Text>
        {approved ?
          <Check className="size-5 shrink-0 text-teal-500/80" />
        : <X className="size-5 shrink-0 text-red-500/80" />}
      </div>
      {comment && (
        <div className="mt-1 rounded-lg bg-yellow-500/10 px-2.5 py-1">
          <Strong className="text-sm/6">Comentario del evaluador:</Strong>
          <Text>{comment}</Text>
        </div>
      )}
    </div>
  )
}
