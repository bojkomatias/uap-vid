import Profile from '@auth/profile'
import { PageHeading } from '@layout/page-heading'
import { authOptions } from 'app/api/auth/[...nextauth]/route'
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
