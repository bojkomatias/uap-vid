/* eslint-disable @next/next/no-img-element */
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Button } from '../components/Atomic/Button'

function SignIn() {
    const { data: session } = useSession()
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        if (session) {
            console.log(session)
            router.push('/protected')
        }
    }, [session])

    return (
        <div className="shadowCustom flex h-[55vh] flex-col items-center justify-center">
            <div className="mb-4 flex w-[80%] grow items-center text-sm font-bold uppercase text-primary">
                <div className="flex flex-col items-center justify-center text-center">
                    <img
                        className="h-[30%]
                        w-[30%] transition-all duration-200 md:h-[50%] md:w-[50%]"
                        src="/UAPazul.png"
                    ></img>
                    <p>Vicerrectoría de Investigación y Desarrollo</p>
                </div>
            </div>

            <form
                className="my-auto flex flex-col"
            >
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
                    <button
                        onClick={(e: any) => {
                            e.preventDefault()
                            console.log('se esta ejecutando esto nieri', process.env.NEXTAUTH_URL)
                            signIn('credentials', {
                                email: email,
                                password: password,
                                redirect: false,
                            })
                        }}
                        className="mb-2 border border-base-200 p-6 font-bold text-primary transition-all duration-200 hover:bg-primary hover:text-white"
                        type="submit"
                    >
                        Iniciar sesión
                    </button>
                    <button
                        className="flex items-center justify-center  border border-base-200 text-primary transition-all duration-200 hover:border hover:border-primary"
                        onClick={(e: any) => {
                            e.preventDefault()
                            console.log('se esta ejecutando aca', process.env.NEXTAUTH_URL)
                            signIn('azure-ad')
                        }}
                    >
                        <div>Iniciar sesión con</div>
                        <img
                            className="ml-2 w-[15%]"
                            src="/microsoft-svgrepo-com.svg"
                        ></img>
                    </button>
                </div>
            </form>
        </div>
    )
}

export default SignIn
