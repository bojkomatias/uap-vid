import { FieldGroup, Fieldset, FormActions } from '@components/fieldset'
import { notifications } from '@elements/notifications'
import { useForm, zodResolver } from '@mantine/form'
import type { ReviewQuestion } from '@prisma/client'
import { updateQuestion } from '@repositories/review-question'
import { FormButton } from '@shared/form/form-button'
import { FormSwitch } from '@shared/form/form-switch'
import { FormTextarea } from '@shared/form/form-textarea'
import { useMutation } from '@tanstack/react-query'
import { ReviewQuestionSchema } from '@utils/zod'
import { useRouter } from 'next/navigation'
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

  const router = useRouter()

  const { mutate, isPending } = useMutation({
    mutationKey: [question],
    mutationFn: async ({
      data,
      id,
    }: {
      data: Omit<ReviewQuestion, 'id'>
      id: string
    }) => {
      const result = await updateQuestion(data, id)
      if (result) {
        notifications.show({
          title: 'Pregunta de evaluación actualizada',
          message: 'Se modificó la pregunta de evaluación con éxito',
          intent: 'success',
        })
        router.refresh()
      }
    },
  })

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        mutate({ id: question.id, data: values })
      })}
    >
      <Fieldset>
        <FieldGroup>
          <FormSwitch
            label="Estado de la pregunta"
            description={
              form.getInputProps('active').value ? 'Activa' : 'Inactiva'
            }
            checked={form.getInputProps('active').value}
            {...form.getInputProps('active')}
          />
          <FormTextarea
            value={form.getInputProps('question').value}
            description="Editar pregunta"
            label="Texto de la pregunta"
            {...form.getInputProps('question')}
          />
        </FieldGroup>
      </Fieldset>
      <FormActions>
        <FormButton isLoading={isPending}>
          Actualizar pregunta de evaluación
        </FormButton>
      </FormActions>
    </form>
  )
}
