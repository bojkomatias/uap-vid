import type { ReviewQuestionType as ReviewQuestion } from '@prisma/client'
import { getAllQuestions } from '@repositories/review-question'
import { QueryClient, useQuery } from '@tanstack/react-query'
import { Check, X } from 'tabler-icons-react'

export default async function ReviewQuestionView({
  id,
  approved,
  comment,
  index,
}: ReviewQuestion & { index: number }) {
  const queryClient = new QueryClient()
  const {
    isLoading,
    error,
    data: questions,
  } = useQuery<ReviewQuestion[]>({
    queryKey: ['questions'],
    queryFn: async () => await getAllQuestions(),
  })

  return (
    <div>
      <div className="flex gap-1 text-xs text-gray-600">
        <b>{index + 1}- </b>
        <div className="flex-grow">
          {questions.find((question) => question.id === id)?.question}
        </div>

        <div>
          {approved ?
            <Check className="h-4 w-4 text-success-600" />
          : <X className="h-4 w-4 text-error-600" />}
        </div>
      </div>
      <div className="mt-1 pl-4 text-xs font-light text-gray-900">
        {comment}
      </div>
    </div>
  )
}
