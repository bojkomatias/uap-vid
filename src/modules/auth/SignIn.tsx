'use client'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { showNotification, useNotifications } from '@mantine/notifications'
import { Button } from '@elements/Button'
import Image from 'next/image'

export const SignIn = () => {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const notifications = useNotifications()

    return (
        <div className="shadowCustom mx-auto flex max-w-xl flex-col items-center justify-center pt-4 pb-12">
            <div className=" flex items-center text-sm font-bold uppercase text-primary">
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Image
                        className="h-[30%]
                        w-[30%] transition duration-200 md:h-[50%] md:w-[50%]"
                        src="/UAPazul.png"
                        alt="UAP Logo"
                        width={400}
                        height={400}
                    />
                    <p>Vicerrectoría de Investigación y Desarrollo</p>
                </div>
            </div>

            <div className=" flex w-full flex-col items-stretch gap-6 px-24">
                <input
                    type="email"
                    className="input"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    className="input"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                    onClick={async () => {
                        const res = await signIn('credentials', {
                            email: email,
                            password: password,
                            redirect: false,
                        })

                        if (res?.status !== 200)
                            return notifications.showNotification({
                                title: 'No se pudo iniciar sesión',
                                message: 'Credenciales inválidas',
                                color: 'red',
                            })
                        router.push('/protocols')
                    }}
                    type="submit"
                >
                    Iniciar sesión
                </Button>
                <Button
                    onClick={(e: any) => {
                        e.preventDefault()
                        signIn('azure-ad', { callbackUrl: '/protocols' })
                    }}
                >
                    <span>Iniciar sesión con</span>
                    <Image
                        className="-my-6 ml-2"
                        src="/microsoft-svgrepo-com.svg"
                        alt="Microsoft Logo"
                        width={70}
                        height={20}
                    />
                </Button>
            </div>
        </div>
    )
}
