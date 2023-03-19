import UserForm from '@admin/UserForm'
import Navigation from '@auth/Navigation'
import { Heading } from '@layout/Heading'

export default async function Page() {
    return (
        // @ts-expect-error async ServerComponent
        <Navigation>
            <Heading title="Crear nuevo usuario" />
            <UserForm />
        </Navigation>
    )
}
