'use client'

import React, { useCallback, useTransition } from 'react'
import { FieldGroup, Fieldset, FormActions, Legend } from '@components/fieldset'
import { FormInput } from '@shared/form/form-input'
import type { User } from '@prisma/client'
import { useForm, zodResolver } from '@mantine/form'
import type { z } from 'zod'
import { SubmitButton } from '@shared/submit-button'
import { notifications } from '@elements/notifications'
import { signOut } from 'next-auth/react'
import {
  verifyUserData,
  verifyUserDataMicrosoftUsers,
} from '@repositories/user'
import {
  VerifyUserDataMicrosoftUsersSchema,
  VerifyUserDataSchema,
} from '@utils/zod'

export function VerifyUserDataForm({ user }: { user: User }) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof VerifyUserDataSchema>>({
    initialValues: {
      name: user.name,
      dni: '',
      newPassword: '',
      newPasswordConfirm: '',
    },
    validate: zodResolver(VerifyUserDataSchema),
    validateInputOnBlur: true,
  })

  const submitVerifyUserData = useCallback(
    async (userDataUpdated: z.infer<typeof VerifyUserDataSchema>) => {
      startTransition(async () => {
        const updated = await verifyUserData(user.id, userDataUpdated)
        if (updated)
          notifications.show({
            title: 'Sus datos fueron guardados con éxito',
            message: 'Para continuar, vuelva a iniciar sesión',
            intent: 'success',
          })
        setTimeout(() => {
          signOut({ callbackUrl: '/' })
        }, 5000)
      })
    },
    [user.id]
  )

  return (
    <form onSubmit={form.onSubmit((values) => submitVerifyUserData(values))}>
      <Fieldset>
        <Legend>Complete sus datos y actualice su contraseña</Legend>
        <FieldGroup>
          <FormInput
            label="Nombre"
            description="Verifique que su nombre completo esté bien escrito"
            {...form.getInputProps('name')}
          />

          <FormInput
            label="DNI"
            type="number"
            description="Añada su número de DNI"
            placeholder="12345678"
            {...form.getInputProps('dni')}
          />
          <FormInput
            label="Nueva contraseña"
            type="password"
            description="Introduzca una nueva contraseña"
            placeholder="········"
            {...form.getInputProps('newPassword')}
          />
          <FormInput
            label="Confirme su nueva contraseña"
            type="password"
            description="Repita la nueva contraseña"
            placeholder="········"
            {...form.getInputProps('newPasswordConfirm')}
          />
        </FieldGroup>
      </Fieldset>
      <FormActions>
        <SubmitButton isLoading={isPending}>Actualizar datos</SubmitButton>
      </FormActions>
    </form>
  )
}

export function VerifyUserDataFormMicrosoftUsers({ user }: { user: User }) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof VerifyUserDataMicrosoftUsersSchema>>({
    initialValues: {
      name: user.name,
      dni: '',
    },
    validate: zodResolver(VerifyUserDataMicrosoftUsersSchema),
    validateInputOnBlur: true,
  })

  const submitVerifyUserData = useCallback(
    async (
      userDataUpdated: z.infer<typeof VerifyUserDataMicrosoftUsersSchema>
    ) => {
      const updated = await verifyUserDataMicrosoftUsers(
        user.id,
        userDataUpdated
      )
      if (updated)
        notifications.show({
          title: 'Sus datos fueron guardados con éxito',
          message: 'Para continuar, vuelva a iniciar sesión',
          intent: 'success',
        })
      startTransition(() => {
        setTimeout(() => {
          signOut({ callbackUrl: '/' })
        }, 2500)
      })
    },
    [user.id]
  )

  return (
    <form onSubmit={form.onSubmit((values) => submitVerifyUserData(values))}>
      <Fieldset>
        <Legend>Confirme y complete sus datos</Legend>
        <FieldGroup>
          <FormInput
            label="Nombre"
            description="Verifique que su nombre completo esté bien escrito"
            {...form.getInputProps('name')}
          />

          <FormInput
            label="DNI"
            type="number"
            description="Añada su número de DNI"
            placeholder="12345678"
            {...form.getInputProps('dni')}
          />
        </FieldGroup>
      </Fieldset>
      <FormActions>
        <SubmitButton isLoading={isPending}>Actualizar datos</SubmitButton>
      </FormActions>
    </form>
  )
}
