'use client'

import { signIn } from 'next-auth/react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Disclosure,
  DisclosurePanel,
  DisclosureButton,
} from '@headlessui/react'
import { notifications } from '@elements/notifications'
import { Button } from '@components/button'
import { Divider } from '@components/divider'
import { Strong, Text } from '@components/text'
import { FieldGroup, Fieldset, FormActions } from '@components/fieldset'
import { FormInput } from '@shared/form/form-input'
import { useForm } from '@mantine/form'
import { QuestionMark } from 'tabler-icons-react'
import Info from '@shared/info'
import { SubmitButton } from '@shared/submit-button'

export const SignIn = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingMicrosoft, setLoadingMicrosoft] = useState(false)

  const form = useForm({ initialValues: { email: '', password: '' } })

  const submitLogin = async ({
    email,
    password,
  }: {
    email: string
    password: string
  }) => {
    setLoading(true)

    const res = await signIn('credentials', {
      email: email,
      password: password,
      redirect: false,
      callbackUrl: '/protocols',
    })

    if ((res && res.status !== 200) || (res && res.error)) {
      setLoading(false)
      notifications.show({
        title: 'No se pudo iniciar sesión',
        message: 'Credenciales inválidas',
        intent: 'error',
      })
    } else {
      setLoading(false)
      router.refresh()
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

      <Button
        color="primary"
        disabled={loadingMicrosoft}
        onClick={(e: any) => {
          setLoadingMicrosoft(true)
          e.preventDefault()
          signIn('azure-ad', { callbackUrl: '/protocols' })
        }}
        className="mt-4 w-full"
      >
        Iniciar sesión con
        <Image
          className="-my-6 -ml-2"
          src={'/blackbackgroundmicrosoft.png'}
          alt="Microsoft Logo"
          width={100}
          height={50}
        />
      </Button>

      <Divider className="my-6" />

      <Disclosure as="div">
        <div className={'relative mx-auto flex w-fit'}>
          <DisclosureButton>
            <Text>
              Si tenés credenciales locales,
              <Strong> click aquí para iniciar sesión</Strong>
            </Text>
          </DisclosureButton>
          <Info content="Si se te asignó uno o más proyectos para evaluar, las credenciales que le envió el secretario de investigación son credenciales locales.">
            <QuestionMark
              className="absolute -right-6 -top-4 p-2 opacity-50 hover:opacity-100"
              size={30}
            />
          </Info>
        </div>
        <div className="overflow-hidden py-2">
          <DisclosurePanel
            transition
            className="origin-top transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0"
          >
            <form
              onSubmit={form.onSubmit((values) => {
                submitLogin(values)
              })}
            >
              <Fieldset>
                <FieldGroup>
                  <FormInput
                    type="email"
                    label="Email"
                    placeholder="example@example.com"
                    {...form.getInputProps('email')}
                  />
                  <FormInput
                    type="password"
                    label="Contraseña"
                    placeholder="········"
                    {...form.getInputProps('password')}
                  />
                </FieldGroup>
              </Fieldset>
              <FormActions>
                <SubmitButton isLoading={loading}>Iniciar sesión</SubmitButton>
              </FormActions>
            </form>
          </DisclosurePanel>
        </div>
      </Disclosure>
    </div>
  )
}
