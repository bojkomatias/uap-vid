'use client'

import React, { useCallback, useTransition } from 'react'
import { FieldGroup, Fieldset, FormActions } from '../../components/fieldset'
import { FormInput } from '../../shared/form/form-input'
import Image from 'next/image'
import type { User } from '@prisma/client'
import { useForm, zodResolver } from '@mantine/form'
import type { z } from 'zod'
import { FormButton } from '@shared/form/form-button'
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
      const updated = await verifyUserData(user.id, userDataUpdated)
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
    <div className="mx-auto flex min-h-screen max-w-sm flex-col items-center pt-24">
      <div className="flex flex-col items-center justify-center pb-4 text-center text-xs font-bold uppercase text-primary">
        <Image src="/UAPazul.png" alt="UAP Logo" width={300} height={300} />
        <p>Vicerrectoría de Investigación y Desarrollo</p>
      </div>

      <form
        className="flex w-full flex-col items-stretch gap-3"
        onSubmit={form.onSubmit((values) => submitVerifyUserData(values))}
      >
        <Fieldset>
          <FieldGroup className="@xl:grid @xl:grid-cols-2 @xl:gap-6 @xl:space-y-0">
            <FormInput
              label="Nombre"
              description="Verifique que su nombre completo esté bien escrito"
              {...form.getInputProps('name')}
            />

            <FormInput
              label="DNI"
              type="number"
              description="Añada su número de DNI"
              placeholder="12 345 678"
              {...form.getInputProps('dni')}
            />
            <FormInput
              label="Nueva contraseña"
              type="password"
              description="Introduzca una nueva contraseña"
              placeholder="****************"
              {...form.getInputProps('newPassword')}
            />
            <FormInput
              label="Confirme su nueva contraseña"
              type="password"
              description="Repita la nueva contraseña"
              placeholder="****************"
              {...form.getInputProps('newPasswordConfirm')}
            />
          </FieldGroup>
        </Fieldset>
        <FormActions>
          <FormButton isLoading={isPending}>Actualizar datos</FormButton>
        </FormActions>
      </form>
    </div>
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
    <div className="mx-auto flex min-h-screen max-w-sm flex-col items-center pt-24">
      <div className="flex flex-col items-center justify-center pb-4 text-center text-xs font-bold uppercase text-primary">
        <Image src="/UAPazul.png" alt="UAP Logo" width={300} height={300} />
        <p>Vicerrectoría de Investigación y Desarrollo</p>
      </div>

      <form
        className="flex w-full flex-col items-stretch gap-3"
        onSubmit={form.onSubmit((values) => submitVerifyUserData(values))}
      >
        <Fieldset>
          <FieldGroup className="@xl:grid @xl:grid-cols-2 @xl:gap-6 @xl:space-y-0">
            <FormInput
              label="Nombre"
              description="Verifique que su nombre completo esté bien escrito"
              {...form.getInputProps('name')}
            />

            <FormInput
              label="DNI"
              type="number"
              description="Añada su número de DNI"
              placeholder="12 345 678"
              {...form.getInputProps('dni')}
            />
          </FieldGroup>
        </Fieldset>
        <FormActions>
          <FormButton isLoading={isPending}>Actualizar datos</FormButton>
        </FormActions>
      </form>
    </div>
  )
}
