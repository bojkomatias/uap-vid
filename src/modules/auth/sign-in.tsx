'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { notifications } from '@mantine/notifications'
import { Button } from '@elements/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Disclosure, Transition } from '@headlessui/react'

export const SignIn = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [loadingMicrosoft, setLoadingMicrosoft] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return (
        <div className="absolute left-1/2 top-[8%] mx-auto flex max-w-xl  -translate-x-1/2 flex-col items-center ">
            <div className=" flex items-center text-sm font-bold uppercase text-primary">
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Image
                        className="h-[30%]
                        w-[30%] transition duration-200 md:h-[50%] md:w-[50%]"
                        src="/UAPazul.png"
                        alt="UAP Logo"
                        width={600}
                        height={600}
                    />
                    <p>Vicerrectoría de Investigación y Desarrollo</p>
                </div>
            </div>
            <form
                className="flex w-full flex-col items-stretch gap-3 px-24"
                onSubmit={async (e) => {
                    e.preventDefault()
                    setLoading(true)
                    const res = await signIn('credentials', {
                        email: email,
                        password: password,
                        redirect: false,
                        callbackUrl: '/protocols',
                    })
                    if (res && res.status !== 200) {
                        setLoading(false)
                        notifications.show({
                            title: 'No se pudo iniciar sesión',
                            message: 'Credenciales inválidas',
                            color: 'red',
                        })
                    } else {
                        setLoading(false)
                        router.refresh()
                    }
                }}
            >
                <div className="text-xs text-primary/80">
                    Iniciar sesión con credenciales institucionales de Office
                    365.
                </div>
                <Button
                    intent="primary"
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
                        <div className="text-xs text-primary/80 transition-all  duration-200 hover:text-primary hover:drop-shadow-sm active:text-primary/30">
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
