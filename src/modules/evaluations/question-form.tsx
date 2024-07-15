import { Fieldset } from '@components/fieldset'
import { useForm, zodResolver } from '@mantine/form'
import type { ReviewQuestion } from '@prisma/client'
import { updateQuestion } from '@repositories/review-question'
import { FormInput } from '@shared/form/form-input'
import { FormSwitch } from '@shared/form/form-switch'
import { useMutation } from '@tanstack/react-query'
import { ReviewQuestionSchema } from '@utils/zod'
import React from 'react'
import type { z } from 'zod'

export default function QuestionForm({
  question,
}: {
  question: ReviewQuestion
}) {
  const form = useForm<z.infer<typeof ReviewQuestionSchema>>({
    initialValues: {
      active: question.active,
      type: question.type,
      question: question.question,
    },
    validate: zodResolver(ReviewQuestionSchema),
  })

  const { data, isSuccess } = useMutation({
    mutationKey: [question],
    mutationFn: async ({
      data,
      id,
    }: {
      data: Omit<ReviewQuestion, 'id'>
      id: string
    }) => {
      await updateQuestion(data, id)
    },
  })

  return (
    <form>
      <Fieldset>
        <div>
          <FormSwitch
            label="Estado de la pregunta"
            description={
              form.getInputProps('active').value ? 'Activa' : 'Inactiva'
            }
            checked={form.getInputProps('active').value}
            {...form.getInputProps('active')}
          />
        </div>
        <FormInput
          value={form.getInputProps('question').value}
          description="Editar pregunta"
          label="Texto de la pregunta"
          {...form.getInputProps('question')}
        />
      </Fieldset>
    </form>
  )
}
