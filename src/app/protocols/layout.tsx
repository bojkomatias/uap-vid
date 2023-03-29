import { CurrentConvocatory } from '@convocatory/index'
import { getCurrentConvocatory } from '@repositories/convocatory'
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
