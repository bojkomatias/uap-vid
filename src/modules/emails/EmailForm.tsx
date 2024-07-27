import { Fieldset, FormActions } from '@components/fieldset'
import { notifications } from '@elements/notifications'
import { useForm, zodResolver } from '@mantine/form'
import type { EmailContentTemplate } from '@prisma/client'
import { updateEmail } from '@repositories/email'
import { FormButton } from '@shared/form/form-button'
import { FormInput } from '@shared/form/form-input'
import { FormTextarea } from '@shared/form/form-textarea'
import { EmailContentTemplateSchema } from '@utils/zod'
import { useRouter } from 'next/navigation'
import type { Dispatch, SetStateAction } from 'react'
import React, { useCallback } from 'react'
import type { z } from 'zod'

export default function EmailForm({
  email,
  callbackFn,
}: {
  email: EmailContentTemplate
  callbackFn: Dispatch<
    SetStateAction<{
      id: string
      useCase: string
      subject: string
      content: string
    }>
  >
}) {
  const router = useRouter()

  const form = useForm<z.infer<typeof EmailContentTemplateSchema>>({
    initialValues: email,
    validate: zodResolver(EmailContentTemplateSchema),
    validateInputOnBlur: true,
  })

  const submitEmail = useCallback(
    async (email: Omit<EmailContentTemplate, 'id'>, id: string) => {
      const updatedEmail = await updateEmail(email, id)

      if (updatedEmail) {
        notifications.show({
          title: 'Email actualizado',
          message: 'El email fue actualizado correctamente.',
          intent: 'success',
        })
      }
      router.refresh()
    },
    [router]
  )

  return (
    <form
      onSubmit={form.onSubmit(({ id, ...values }) => submitEmail(values, id!))}
      onChange={() => {
        callbackFn({
          content: form.getValues().content,
          subject: form.getValues().subject,
          useCase: form.getValues().useCase,
          id: form.getValues().id!,
        })
      }}
      className="rounded-lg border p-4 dark:border-gray-700"
    >
      <Fieldset>
        <FormInput
          description="El asunto del email que recibirá quien corresponda"
          label="Asunto"
          {...form.getInputProps('subject')}
        />
        <FormTextarea
          description="El contenido del email que recibirá quien corresponda"
          label="Contenido"
          {...form.getInputProps('content')}
        />
      </Fieldset>
      <FormActions>
        <FormButton isLoading={false}>Actualizar</FormButton>
      </FormActions>
    </form>
  )
}
