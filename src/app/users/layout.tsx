import Navigation from '@auth/Navigation'
import { Breadcrumb } from '@elements/Breadcrumb'
import { ReactNode } from 'react'

export default function layout({ children }: { children: ReactNode }) {
    return (
        // @ts-expect-error
        <Navigation>
            <Breadcrumb />
            {children}
        </Navigation>
    )
}
