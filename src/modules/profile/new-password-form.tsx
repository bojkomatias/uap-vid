'use client'

import { FieldGroup, Fieldset, FormActions, Legend } from '@components/fieldset'
import { Text } from '@components/text'
import { notifications } from '@elements/notifications'
import { useForm, zodResolver } from '@mantine/form'
import { updateUserPasswordById } from '@repositories/user'
import { FormButton } from '@shared/form/form-button'
import { FormInput } from '@shared/form/form-input'
import { UserPasswordChangeSchema } from '@utils/zod'

export function NewPasswordForm({
  id,
  password,
}: {
  id: string
  password: string
}) {
  const form = useForm({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
    },
    validate: zodResolver(UserPasswordChangeSchema),
  })

  const updateUserPassword = async (data: {
    id: string
    currentPasswordHash: string
    currentPassword: string
    newPassword: string
  }) => {
    const updatedPassword = await updateUserPasswordById(data)

    if (updatedPassword) {
      return notifications.show({
        title: 'Se cambió tu contraseña',
        message: 'Se actualizó tu contraseña con éxito',
        intent: 'success',
      })
    }
    notifications.show({
      title: 'Ocurrió un error',
      message: 'No se pudo actualizar la contraseña',
      intent: 'error',
    })
  }

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        updateUserPassword({
          id: id,
          currentPasswordHash: password,
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        })
      })}
    >
      <Fieldset>
        <Legend>Cambio de contraseña</Legend>
        <Text className="!text-xs">
          Puede cambiar su contraseña introduciendo la actual y eligiendo una
          nueva, los cambios se verán reflejados la próxima vez que inicie
          sesión
        </Text>
        <FieldGroup className="grid gap-1 space-y-0 sm:grid-cols-3">
          <FormInput
            type="password"
            label="Contraseña actual"
            placeholder="••••••••"
            {...form.getInputProps('currentPassword')}
          />
          <FormInput
            type="password"
            label="Nueva contraseña"
            placeholder="••••••••"
            {...form.getInputProps('newPassword')}
          />
          <FormInput
            type="password"
            label="Confirmar contraseña"
            placeholder="••••••••"
            {...form.getInputProps('newPasswordConfirm')}
          />
        </FieldGroup>
      </Fieldset>
      <FormActions>
        <FormButton disabled={!form.isValid()}>Cambiar contraseña</FormButton>
      </FormActions>
    </form>
  )
}
