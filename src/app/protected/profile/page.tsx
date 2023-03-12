import Navigation from '@auth/Navigation'
import Profile from '@auth/ProfileView'
import { Heading } from '@layout/Heading'

export default async function Page() {
    return (
        <Navigation>
            <Heading title="Perfil" />
            <Profile />
        </Navigation>
    )
}
