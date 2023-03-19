import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import Navigation from '@auth/Navigation'

export default async function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)
    if (!session) redirect('/')

    return <Navigation>{children}</Navigation>
}
