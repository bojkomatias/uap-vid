'use client'

import { notifications } from '@elements/notifications'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { z } from 'zod'
import { RoleSchema } from '@utils/zod'
import { useForm, zodResolver } from '@mantine/form'
import { FieldGroup, Fieldset, FormActions } from '@components/fieldset'
import { FormInput } from '@shared/form/form-input'
import { SubmitButton } from '@shared/submit-button'
import { FormListbox } from '@shared/form/form-listbox'
import { RolesDictionary } from '@utils/dictionaries/RolesDictionary'

const CreateUserSchema = z.object({
  name: z
    .string()
    .min(6, { message: 'El nombre debe tener al menos 6 caracteres' }),
  email: z
    .string()
    .email({ message: 'Debe tener el formato de email' })
    .transform((email) => email.toLowerCase()),
  role: RoleSchema,
  password: z
    .string()
    .min(1, { message: 'La contraseña no puede estar vacía' }),
})

export function UserForm() {
  const router = useRouter()

  const [isPending, startTransition] = useTransition()
  const form = useForm<z.infer<typeof CreateUserSchema>>({
    initialValues: {
      name: '',
      email: '',
      role: 'RESEARCHER',
      password: '',
    },
    validate: zodResolver(CreateUserSchema),
    validateInputOnBlur: true,
  })

  const submitNewUser = async (user: z.infer<typeof CreateUserSchema>) => {
    const res = await fetch(`/api/auth/signup`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
    if (res.status === 201) {
      notifications.show({
        title: 'Usuario creado',
        message: 'El usuario fue creado correctamente',
        intent: 'success',
      })
      startTransition(() => router.refresh())
    }
    if (res.status === 422) {
      return notifications.show({
        title: 'Usuario existente',
        message: 'Un usuario ya existe con ese email',
        intent: 'error',
      })
    }
  }

  return (
    <form onSubmit={form.onSubmit((values) => submitNewUser(values))}>
      <Fieldset>
        <FieldGroup>
          <FormInput
            label="Nombre"
            description="Nombre del usuario"
            {...form.getInputProps('name')}
          />
          <FormInput
            type="email"
            label="Email"
            description="Email del usuario"
            {...form.getInputProps('email')}
          />
          <FormInput
            type="password"
            label="Contraseña"
            description="Una contraseña, luego será modificada por el usuario cuando inicie sesión por primera vez"
            {...form.getInputProps('password')}
          />
          <FormListbox
            label="Rol"
            description="El rol mediante el cual el usuario va a interactuar con el sistema"
            options={Object.entries(RolesDictionary).map(([value, label]) => ({
              value,
              label,
            }))}
            {...form.getInputProps('role')}
          />
        </FieldGroup>
      </Fieldset>
      <FormActions>
        <SubmitButton isLoading={isPending}>Crear usuario</SubmitButton>
      </FormActions>
    </form>
  )
}
