import React from 'react'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { useSession, signIn, signOut } from 'next-auth/react'
export default function profile() {
    return (
        <>
            <div className="-translate-y-12 text-4xl font-bold text-primary">
                Perfil
            </div>
            <div className="-translate-y-8 p-20 text-primary">
                {' '}
                <button
                    className="p-4 font-bold transition-all duration-200 hover:bg-primary hover:text-white"
                    onClick={() => signOut()}
                >
                    Cerrar sesión
                </button>
            </div>
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
