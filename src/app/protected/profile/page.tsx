import Navigation from '@auth/Navigation'
import Profile from '@auth/ProfileView'
import { Heading } from '@layout/Heading'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'

export default async function Page() {
    const session = await getServerSession(authOptions)
    return (
        // @ts-expect-error async ServerComponent
        <Navigation>
            <Heading title="Perfil" />
            <Profile />
        </Navigation>
    )
}
