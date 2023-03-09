import Profile from '@auth/ProfileView'
import { Heading } from '@layout/Heading'

export default async function Page() {
    return (
        <>
            <div className="grow">
                <Heading title="Perfil" />
                <Profile />
            </div>
        </>
    )
}
