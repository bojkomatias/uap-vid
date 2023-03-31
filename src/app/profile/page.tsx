import Profile from '@auth/profile'
import { Heading } from '@layout/c-heading'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'

export default async function Page() {
    const session = await getServerSession(authOptions)
    return (
        <>
            <Heading title="Perfil" />
            <Profile user={session?.user!} />
        </>
    )
}
