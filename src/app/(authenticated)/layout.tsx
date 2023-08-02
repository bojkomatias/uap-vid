import Navigation from '@auth/navigation'
import { Breadcrumbs } from '@elements/breadcrumbs'

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <Navigation>
            <Breadcrumbs />
          
            {children}
        </Navigation>
    )
}
