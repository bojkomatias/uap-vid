import UserForm from '@admin/UserForm'
import Navigation from '@auth/Navigation'
import { Heading } from '@layout/Heading'

export default function Page() {
    return (
        <Navigation>
            <Heading title="Crear nuevo usuario" />
            <UserForm />
        </Navigation>
    )
}
