'use client'
import { signIn, signOut } from 'next-auth/react'
import { useState } from 'react'
import { Button } from '@elements/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Disclosure, Transition } from '@headlessui/react'
import { notifications } from '@elements/notifications'
import React from 'react'

export default function Page() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingMicrosoft, setLoadingMicrosoft] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col items-center pt-24">
      <div className="flex flex-col items-center justify-center py-12 text-center text-xs font-bold uppercase text-primary">
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
        <p className="text-center text-xs font-medium text-gray-700">
          Para hacer uso de la plataforma, es necesario que añada y/o verifique
          los siguientes datos:
        </p>

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
          onClick={() => {
            signOut({ callbackUrl: '/' })
          }}
          loading={loading}
        >
          Confirmar
        </Button>
      </form>
    </div>
  )
}
