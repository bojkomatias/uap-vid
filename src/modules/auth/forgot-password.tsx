'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from '@mantine/form'
import { notifications } from '@elements/notifications'
import { Button } from '@components/button'
import { Strong, Text } from '@components/text'
import { FieldGroup, Fieldset, FormActions } from '@components/fieldset'
import { FormInput } from '@shared/form/form-input'
import { SubmitButton } from '@shared/submit-button'
import Image from 'next/image'

export const ForgotPassword = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm({ initialValues: { email: '' } })

  const handleForgotPassword = async ({ email }: { email: string }) => {
    setLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        notifications.show({
          title: 'Código enviado',
          message:
            'Si existe una cuenta con este email, recibirás un código de recuperación.',
          intent: 'success',
        })
        // Redirect to reset password page
        router.push(`/reset-password?email=${encodeURIComponent(email)}`)
      } else {
        notifications.show({
          title: 'Error',
          message: data.error || 'Ocurrió un error al enviar el código',
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
        <Strong className="text-xl">Recuperar Contraseña</Strong>
        <Text className="mt-2 text-sm">
          Ingresá tu email y te enviaremos un código para restablecer tu
          contraseña.
        </Text>
      </div>

      <form
        onSubmit={form.onSubmit((values) => {
          handleForgotPassword(values)
        })}
      >
        <Fieldset>
          <FieldGroup>
            <FormInput
              type="email"
              label="Email"
              placeholder="ejemplo@ejemplo.com"
              {...form.getInputProps('email')}
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
          <SubmitButton isLoading={loading}>Enviar código</SubmitButton>
        </FormActions>
      </form>
    </div>
  )
}
