import Navigation, { AppLayout } from '@auth/navigation'
import { Breadcrumbs } from '@elements/breadcrumbs'

export default async function RootLayout({
    children,
    drawer,
}: {
    children: React.ReactNode
    drawer: React.ReactNode
}) {
    return (
        <AppLayout>
            <Breadcrumbs />
            {children}
            {drawer}
        </AppLayout>
    )
}
