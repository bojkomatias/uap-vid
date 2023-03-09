import { unstable_getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await unstable_getServerSession()
    if (!session) redirect('/')

    return children
}
