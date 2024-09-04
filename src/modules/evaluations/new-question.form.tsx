import { FieldGroup, Fieldset, FormActions } from '@components/fieldset'
import { notifications } from '@elements/notifications'
import { useForm, zodResolver } from '@mantine/form'
import type { ReviewQuestion } from '@prisma/client'
import { newQuestion } from '@repositories/review-question'
import { SubmitButton } from '@shared/submit-button'
import { FormTextarea } from '@shared/form/form-textarea'
import { useMutation } from '@tanstack/react-query'
import { ReviewQuestionSchema } from '@utils/zod'
import { useRouter } from 'next/navigation'
import React from 'react'
import type { z } from 'zod'

export default function NewQuestionForm({ type }: { type: string }) {
  const form = useForm<z.infer<typeof ReviewQuestionSchema>>({
    initialValues: {
      active: true,
      type: type,
      question: '',
    },
    validate: zodResolver(ReviewQuestionSchema),
  })

  const router = useRouter()

  const { mutate, isPending } = useMutation({
    mutationKey: ['new_question'],
    mutationFn: async (values: Omit<ReviewQuestion, 'id'>) => {
      const result = await newQuestion(values)
      if (result) {
        notifications.show({
          title: 'Pregunta de evaluación creada',
          message: 'Se creó una nueva pregunta de evaluación con éxito',
          intent: 'success',
        })
        router.refresh()
      }
    },
  })

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        mutate(values)
      })}
    >
      <Fieldset>
        <FieldGroup>
          <FormTextarea
            autoFocus
            value={form.getInputProps('question').value}
            description="Nueva pregunta"
            label="Texto de la pregunta"
            {...form.getInputProps('question')}
          />
        </FieldGroup>
      </Fieldset>
      <FormActions>
        <SubmitButton isLoading={isPending}>Guardar</SubmitButton>
      </FormActions>
    </form>
  )
}
