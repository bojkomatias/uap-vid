import React from 'react'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { mapRange } from 'gsap'

export default function profile() {
    const session = useSession().data
    console.log(session)

    return (
        <>
            <div className="h-full grow">
                <div className=" -translate-y-12 text-4xl font-bold text-primary">
                    Perfil
                </div>
                <div className="flex h-full -translate-y-8 flex-col p-20 text-primary">
                    <div className="flex  flex-col">
                        <div className="text-3xl">
                            Email: {session.user?.email}
                        </div>
                        <div className="text-xl">
                            Rol de usuario: {session.user?.user?.role}
                        </div>
                    </div>
                </div>
            </div>
            <button
                className="mr-16 mb-10 self-end p-4 font-bold text-primary transition-all duration-200 hover:bg-primary hover:text-white"
                onClick={() => signOut()}
            >
                Cerrar sesión
            </button>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getSession({ req: ctx.req })
    if (!session) {
        return {
            redirect: {
                destination: '/api/auth/signin',
                permanent: false,
            },
        }
    }
    return {
        props: { session },
    }
}
