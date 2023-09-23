import Navigation from '@auth/navigation'
import { Breadcrumbs } from '@elements/breadcrumbs'

export default async function RootLayout({
    children,
    drawer,
}: {
    children: React.ReactNode
    drawer: React.ReactNode
}) {
    return (
        <Navigation>
            <Breadcrumbs />
            {children}
            {drawer}
        </Navigation>
    )
}
