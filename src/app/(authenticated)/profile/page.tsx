import Profile from '@auth/profile'
import { PageHeading } from '@layout/page-heading'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'

export default async function Page() {
    const session = await getServerSession(authOptions)
    if (!session) return

    return (
        <>
            <PageHeading title="Perfil" />
            <Profile user={session.user} />
        </>
    )
}
