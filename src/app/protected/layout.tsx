import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import Navigation from '@auth/Navigation'
import { Breadcrumb } from '@elements/Breadcrumb'

export default async function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)
    if (!session) redirect('/')

    return (
        <Navigation>
            <Breadcrumb className="mb-6"></Breadcrumb>
            {children}
        </Navigation>
    )
}
