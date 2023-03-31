'use client'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useNotifications } from '@mantine/notifications'
import { Button } from '@elements/button'
import Image from 'next/image'

export const SignIn = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [loadingMicrosoft, setLoadingMicrosoft] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const notifications = useNotifications()

    return (
        <div className="mx-auto flex max-w-xl flex-col items-center justify-center pb-12 pt-4">
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
                    disabled={loading}
                    onClick={async () => {
                        setLoading(true)
                        const res = await signIn('credentials', {
                            email: email,
                            password: password,
                            redirect: false,
                        })
                        if (res?.status !== 200) {
                            setLoading(false)
                            notifications.showNotification({
                                title: 'No se pudo iniciar sesión',
                                message: 'Credenciales inválidas',
                                color: 'red',
                            })
                        }
                        setLoading(false)
                        return router.refresh()
                    }}
                >
                    {loading ? (
                        <span className="loader-primary h-5 w-5"></span>
                    ) : (
                        'Iniciar sesión'
                    )}
                </Button>
                <Button
                    disabled={loading}
                    onClick={(e: any) => {
                        setLoadingMicrosoft(true)
                        e.preventDefault()
                        signIn('azure-ad', { callbackUrl: '/protocols' })
                    }}
                >
                    {loadingMicrosoft ? (
                        <span className="loader-primary h-5 w-5"></span>
                    ) : (
                        <>
                            <span>Iniciar sesión con</span>
                            <Image
                                className="-my-6 ml-2"
                                src="/microsoft-svgrepo-com.svg"
                                alt="Microsoft Logo"
                                width={70}
                                height={20}
                            />
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
