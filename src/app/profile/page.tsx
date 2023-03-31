import Profile from '@auth/profile'
import { PageHeading } from '@layout/page-heading'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'

export default async function Page() {
    const session = await getServerSession(authOptions)
    return (
        <>
            <PageHeading title="Perfil" />
            <Profile user={session?.user!} />
        </>
    )
}
