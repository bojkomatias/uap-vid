'use client'

import { Button } from '@components/button'
import { FieldGroup, Fieldset, FormActions } from '@components/fieldset'
import { notifications } from '@elements/notifications'
import { useForm, zodResolver } from '@mantine/form'
import { updateUserEmailById } from '@repositories/user'
import { FormButton } from '@shared/form/form-button'
import { FormInput } from '@shared/form/form-input'
import { emailer } from '@utils/emailer'
import { useCases } from '@utils/emailer/use-cases'
import { UserEmailChangeSchema } from '@utils/zod'
import { useState } from 'react'

export function NewEmailForm({ id, email }: { id: string; email: string }) {
  const emailForm = useForm({
    initialValues: {
      currentEmail: email,
      newEmail: '',
      emailCode: '',
    },
    validate: zodResolver(UserEmailChangeSchema),
  })

  const updateUserEmail = async ({
    id,
    email,
  }: {
    id: string
    email: string
  }) => {
    const updatedEmail = await updateUserEmailById(id, email)

    if (updatedEmail)
      return notifications.show({
        title: 'Se cambió tu Email',
        message: 'Vas a ver los cambios cuando vuelvas a iniciar sesión',
        intent: 'success',
      })

    notifications.show({
      title: 'Ocurrió un error',
      message: 'No se pudo actualizar el Email',
      intent: 'error',
    })
  }

  // I'm using useState because at some point it might be useful to change the random code. For now, it changes every time the drawer is rendered.
  const [random] = useState((Math.random() + 1).toString(36).substring(7))

  const sendEmail = async ({
    email,
    randomString,
  }: {
    email: string
    randomString: string
  }) => {
    const emailData = {
      email,
      randomString,
      useCase: useCases.changeUserEmail,
    }

    await emailer(emailData)

    notifications.show({
      title: 'Se envió un código a tu Email',
      message:
        'Revisá tu bandeja de entrada y copiá el código y pegalo en la entrada de texto que dice "código"',
      intent: 'info',
    })
  }

  return (
    <form
      onSubmit={emailForm.onSubmit((values) => {
        updateUserEmail({
          id: id,
          email: values.newEmail,
        })
      })}
    >
      <Fieldset>
        <FieldGroup className="flex items-end gap-1">
          <FormInput
            className="grow"
            type="email"
            label="Cambiar email"
            description="Introduzca el nuevo email, se enviara un código a su email actual para verificar"
            {...emailForm.getInputProps('newEmail')}
          />
          <Button
            type="button"
            color="light"
            onClick={async () => {
              if (!emailForm.getInputProps('newEmail').error) {
                await sendEmail({
                  email: email,
                  randomString: random!,
                })
                document
                  .getElementById('emailCodeConfirmation')
                  ?.classList.remove('hidden')
                document
                  .getElementById('emailCodeConfirmation')
                  ?.classList.add('fade-in')
              }
            }}
          >
            Enviar código
          </Button>
        </FieldGroup>

        <FieldGroup id="emailCodeConfirmation" className="hidden">
          <FormInput
            label="Código de confirmacion"
            description="Introduzca el código de confirmación que fue enviado a su email actual"
            {...emailForm.getInputProps('emailCode')}
          />
        </FieldGroup>
      </Fieldset>
      <FormActions>
        <FormButton disabled={!emailForm.isValid()}>Cambiar email</FormButton>
      </FormActions>
    </form>
  )
}
