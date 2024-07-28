'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { Button } from '@components/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Transition,
} from '@headlessui/react'
import { notifications } from '@elements/notifications'
import { FormInput } from '@shared/form/form-input'
import { Strong, Text } from '@components/text'
import { Divider } from '@components/divider'
import { FieldGroup } from '@components/fieldset'

export const SignIn = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingMicrosoft, setLoadingMicrosoft] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="flex min-h-screen flex-col items-center bg-white pt-16 dark:bg-gray-950">
      <div className="flex flex-col items-center justify-center py-12 text-center text-sm font-bold uppercase tracking-[-0.07em] text-primary-950 dark:grayscale dark:invert">
        <Image src="/UAPazul.png" alt="UAP Logo" width={300} height={300} />
        <p>Vicerrectoría de Investigación y Desarrollo</p>
      </div>

      <form
        className="flex max-w-sm flex-col items-stretch gap-3"
        onSubmit={async (e) => {
          e.preventDefault()
          setLoading(true)

          const res = await signIn('credentials', {
            email: email,
            password: password,
            redirect: false,
            callbackUrl: '/',
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
        }}
      >
        <Text>Iniciar sesión con credenciales institucionales.</Text>
        <Button
          type="button"
          disabled={loadingMicrosoft}
          onClick={(e: any) => {
            setLoadingMicrosoft(true)
            e.preventDefault()
            signIn('azure-ad', { callbackUrl: '/protocols' })
          }}
        >
          <span>Iniciar sesión con</span>
          <Image
            className="-my-6 -ml-3"
            src={'/blackbackgroundmicrosoft.png'}
            alt="Microsoft Logo"
            width={90}
            height={50}
          />
        </Button>
        <Divider className="mt-3" />
        <Disclosure>
          <DisclosureButton className="relative mb-3 w-full">
            <Text>
              Si no tenés cuenta de Microsoft,{' '}
              <Strong className="hover:underline">iniciá sesión acá</Strong>.
            </Text>
          </DisclosureButton>
          <Transition
            enter="transform transition ease-in-out duration-500 sm:duration-500"
            enterFrom="translate-y-full opacity-0"
            enterTo="translate-y-0 opacity-100"
            leave="transform transition ease-in-out duration-500 sm:duration-500"
            leaveFrom="translate-y-0 opacity-100"
            leaveTo="translate-y-full opacity-0"
          >
            <DisclosurePanel className="flex w-full flex-col items-stretch gap-6">
              <FieldGroup>
                <FormInput
                  label="Email"
                  type="email"
                  placeholder="Email"
                  required
                  onChange={(e: any) => setEmail(e.target.value)}
                />
                <FormInput
                  label="Contraseña"
                  type="password"
                  placeholder="Contraseña"
                  required
                  onChange={(e: any) => setPassword(e.target.value)}
                />
              </FieldGroup>
              <Button color="dark/white" type="submit" disabled={loading}>
                Iniciar sesión
              </Button>
            </DisclosurePanel>
          </Transition>
        </Disclosure>
      </form>
    </div>
  )
}
