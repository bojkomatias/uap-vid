import { PageHeading } from '@layout/page-heading'
import UserForm from '@user/user-form'

export default async function Page() {
    return (
        <>
            <PageHeading title="Crear nuevo usuario" />
            <UserForm />
        </>
    )
}
