'use client'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { showNotification } from '@mantine/notifications'
import { Button } from '@elements/Button'

export const SignIn = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return (
        <div className="shadowCustom flex h-fit flex-col items-center justify-center">
            <div className="mb-4 flex w-[80%] grow items-center text-sm font-bold uppercase text-primary">
                <div className="flex flex-col items-center justify-center py-6 text-center">
                    <img
                        className="h-[30%]
                        w-[30%] transition-all duration-200 md:h-[50%] md:w-[50%]"
                        src="/UAPazul.png"
                    />
                    <p>Vicerrectoría de Investigación y Desarrollo</p>
                </div>
            </div>

            <form className="my-auto flex flex-col">
                <div className="mx-6">
                    {' '}
                    <input
                        type="email"
                        className="input mb-4"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        className="input"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="mx-6 mt-4 mb-10 flex flex-col">
                    <Button
                        onClick={(e: any) => {
                            e.preventDefault()
                            console.log(
                                'se esta ejecutando esto nieri',
                                process.env.NEXTAUTH_URL
                            )

                            signIn('credentials', {
                                email: email,
                                password: password,
                                redirect: false,
                            }).then(({ ok, error }: any) => {
                                if (ok) {
                                    console.log('inicio de sesión exitoso')
                                } else {
                                    showNotification({
                                        title: 'No se pudo iniciar sesión',
                                        message: 'Credenciales inválidas',
                                        color: 'red',
                                    })
                                    console.log(error)
                                }
                            })
                        }}
                        type="submit"
                    >
                        Iniciar sesión
                    </Button>
                    <Button
                        onClick={(e: any) => {
                            e.preventDefault()
                            console.log(
                                'se esta ejecutando aca',
                                process.env.NEXTAUTH_URL
                            )
                            signIn('azure-ad')
                        }}
                    >
                        <div>Iniciar sesión con</div>
                        <img
                            className="ml-2 w-[15%]"
                            src="/microsoft-svgrepo-com.svg"
                            alt="Microsoft Logo"
                        />
                    </Button>
                </div>
            </form>
        </div>
    )
}
