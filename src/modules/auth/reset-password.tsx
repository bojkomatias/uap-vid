'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from '@mantine/form'
import { notifications } from '@elements/notifications'
import { Button } from '@components/button'
import { Strong, Text } from '@components/text'
import { FieldGroup, Fieldset, FormActions } from '@components/fieldset'
import { FormInput } from '@shared/form/form-input'
import { SubmitButton } from '@shared/submit-button'
import Image from 'next/image'

export const ResetPassword = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const [loading, setLoading] = useState(false)

  const form = useForm({
    initialValues: {
      code: '',
      newPassword: '',
      confirmPassword: '',
    },
    validate: {
      code: (value) =>
        value.length === 6 ? null : 'El código debe tener 6 dígitos',
      newPassword: (value) =>
        value.length >= 8
          ? null
          : 'La contraseña debe tener al menos 8 caracteres',
      confirmPassword: (value, values) =>
        value === values.newPassword ? null : 'Las contraseñas no coinciden',
    },
  })

  const handleResetPassword = async ({
    code,
    newPassword,
  }: {
    code: string
    newPassword: string
    confirmPassword: string
  }) => {
    setLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, newPassword }),
      })

      const data = await response.json()

      if (response.ok) {
        notifications.show({
          title: 'Contraseña restablecida',
          message: 'Tu contraseña ha sido actualizada exitosamente.',
          intent: 'success',
        })
        // Redirect to login page
        router.push('/')
      } else {
        notifications.show({
          title: 'Error',
          message: data.error || 'Ocurrió un error al restablecer la contraseña',
          intent: 'error',
        })
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Ocurrió un error al procesar tu solicitud',
        intent: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-gray-200 bg-white p-12 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:shadow-black">
      <div className="mx-auto my-8">
        <Image
          src="/UAPazul.png"
          alt="UAP Logo"
          className="mx-auto dark:brightness-0 dark:grayscale dark:invert"
          width={300}
          height={140}
        />
        <Text className="text-center font-bold tracking-tighter !text-primary-950 dark:!text-gray-200">
          VICERRECTORIA DE INVESTIGACION Y DESARROLLO
        </Text>
      </div>

      <div className="mb-6">
        <Strong className="text-xl">Restablecer Contraseña</Strong>
        <Text className="mt-2 text-sm">
          {email
            ? `Ingresá el código enviado a ${email} y tu nueva contraseña.`
            : 'Ingresá el código que recibiste por email y tu nueva contraseña.'}
        </Text>
      </div>

      <form
        onSubmit={form.onSubmit((values) => {
          handleResetPassword(values)
        })}
      >
        <Fieldset>
          <FieldGroup>
            <FormInput
              type="text"
              label="Código de verificación"
              placeholder="123456"
              maxLength={6}
              {...form.getInputProps('code')}
            />
            <FormInput
              type="password"
              label="Nueva contraseña"
              placeholder="········"
              {...form.getInputProps('newPassword')}
            />
            <FormInput
              type="password"
              label="Confirmar contraseña"
              placeholder="········"
              {...form.getInputProps('confirmPassword')}
            />
          </FieldGroup>
        </Fieldset>
        <FormActions>
          <Button
            type="button"
            color="white"
            onClick={() => router.push('/')}
            disabled={loading}
          >
            Volver
          </Button>
          <SubmitButton isLoading={loading}>Restablecer contraseña</SubmitButton>
        </FormActions>
      </form>
    </div>
  )
}
