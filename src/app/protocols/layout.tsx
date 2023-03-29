import Navigation from '@auth/Navigation'
import { CurrentConvocatory } from '@convocatory/index'
import { Breadcrumb } from '@elements/Breadcrumb'
import { getCurrentConvocatory } from '@repositories/convocatory'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { ReactNode } from 'react'

export default async function layout({ children }: { children: ReactNode }) {
    const convocatory = await getCurrentConvocatory()

    return (
        <>
            {convocatory ? (
                <CurrentConvocatory
                    label="La convocatoria termina:"
                    convocatory={convocatory}
                />
            ) : null}
            {children}
        </>
    )
}
