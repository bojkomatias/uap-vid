'use client'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import gsap from 'gsap'

export const UserAuth = () => {
    const { data: session } = useSession()

    const [showCombo, setShowCombo] = useState(false)

    useEffect(() => {
        gsap.fromTo('#combo', { opacity: 0 }, { opacity: 1, duration: 0.3 })
    }, [showCombo])

    if (session) {
        return (
            <>
                Bienvenido <b>{session?.user?.email} </b>{' '}
                <div
                    className="relative cursor-pointer transition-all duration-150 "
                    onClick={() => setShowCombo(!showCombo)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 hover:scale-[1.07]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.1}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>

                    {showCombo && (
                        <div
                            id="combo"
                            className="absolute right-0 mt-2 w-40 bg-white p-4 text-center opacity-0 shadow-md"
                        >
                            <Link href="/protected/profile" passHref>
                                <button className="mb-1 w-full p-2 text-sm font-bold text-primary transition-all duration-200 hover:bg-primary hover:text-white">
                                    Perfil
                                </button>
                            </Link>
                            <button
                                className="w-full p-2 text-sm font-bold text-primary transition-all duration-200 hover:bg-primary hover:text-white"
                                onClick={() => signOut()}
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    )}
                </div>
            </>
        )
    }
    return <></>
}
