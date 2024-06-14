'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'

import { Button } from '@elements/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Disclosure, Transition } from '@headlessui/react'
import { notifications } from '@elements/notifications'

export const SignIn = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingMicrosoft, setLoadingMicrosoft] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="absolute inset-x-4 top-12 mx-auto flex max-w-sm flex-col items-center">
      <div className="flex flex-col items-center justify-center py-10 text-center text-xs font-bold uppercase text-primary">
        <Image src="/UAPazul.png" alt="UAP Logo" width={300} height={300} />
        <p>Vicerrectoría de Investigación y Desarrollo</p>
      </div>

      <form
        className="flex w-full flex-col items-stretch gap-3"
        onSubmit={async (e) => {
          e.preventDefault()
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
        }}
      >
        <div className="text-center text-xs font-medium text-gray-700">
          Iniciar sesión con credenciales institucionales de Office 365.
        </div>
        <Button
          intent="primary"
          size="md"
          type="button"
          loading={loadingMicrosoft}
          onClick={(e) => {
            setLoadingMicrosoft(true)
            e.preventDefault()
            signIn('azure-ad', { callbackUrl: '/protocols' })
          }}
        >
          <>
            <span>Iniciar sesión con</span>
            <Image
              className="-my-6"
              src={'/blackbackgroundmicrosoft.png'}
              alt="Microsoft Logo"
              width={100}
              height={50}
            />
          </>
        </Button>

        <Disclosure>
          <Disclosure.Button className="relative mb-3 w-full">
            <div className="text-center text-xs font-medium text-gray-700 transition-all duration-200 hover:text-primary hover:drop-shadow-sm active:text-primary/80">
              <div
                className="inset-0 my-4 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t " />
              </div>
              Si tenés credenciales locales,
              <b> iniciá sesión acá</b>.
            </div>
          </Disclosure.Button>
          <Transition
            enter="transform transition ease-in-out duration-500 sm:duration-500"
            enterFrom="translate-y-full opacity-0"
            enterTo="translate-y-0 opacity-100"
            leave="transform transition ease-in-out duration-500 sm:duration-500"
            leaveFrom="translate-y-0 opacity-100"
            leaveTo="translate-y-full opacity-0"
          >
            <Disclosure.Panel className="flex w-full flex-col items-stretch gap-6">
              <input
                type="email"
                className="input"
                placeholder="Email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                className="input"
                placeholder="Password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                intent="primary"
                size="md"
                type="submit"
                loading={loading}
              >
                Iniciar sesión
              </Button>
            </Disclosure.Panel>
          </Transition>
        </Disclosure>
      </form>
    </div>
  )
}
