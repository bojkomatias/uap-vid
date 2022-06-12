import React from 'react'
import { GetServerSideProps } from 'next'
import { getSession } from "next-auth/react"
export default function profile() {
    return (
        <>
            <div className="-translate-y-8 text-4xl font-bold text-primary">
                Perfil
            </div>
            <div className="-translate-y-8">profile</div>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) =>{
    const session = await getSession({ req: ctx.req });
    if (!session) {
        return {
            redirect: {
                destination: '/auth/signin',
                permanent: false,
            },
        };
    }
    return {
        props: { session },
    };
}
