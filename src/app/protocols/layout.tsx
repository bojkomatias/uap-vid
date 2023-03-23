import Navigation from '@auth/Navigation'
import CurrentConvocatory from '@convocatory/index'
import { Breadcrumb } from '@elements/Breadcrumb'
import { getCurrentConvocatory } from '@repositories/convocatory'
import { ReactNode } from 'react'

export default async function layout({ children }: { children: ReactNode }) {
    const convocatory = await getCurrentConvocatory()

    return (
        // @ts-expect-error
        <Navigation>
            <Breadcrumb />
            {convocatory ? (
                <CurrentConvocatory convocatory={convocatory} />
            ) : null}
            {children}
        </Navigation>
    )
}
