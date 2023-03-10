import Navigation from '@auth/Navigation'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import NextAuth from 'pages/api/auth/[...nextauth]'

export default async function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(NextAuth)
    if (!session) redirect('/')

    return <Navigation>{children}</Navigation>
}
