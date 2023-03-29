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
            ) : (
                <span className="label float-right max-w-[10rem] scale-90 text-center text-xs">
                    No existe una convocatoria activa
                </span>
            )}
            {children}
        </>
    )
}
