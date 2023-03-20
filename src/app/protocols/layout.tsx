import { Breadcrumb } from '@elements/Breadcrumb'
import { ReactNode } from 'react'

function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="relative">
            <Breadcrumb />
            {children}
        </div>
    )
}

export default Layout
