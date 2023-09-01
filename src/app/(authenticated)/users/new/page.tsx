import { PageHeading } from '@layout/page-heading'
import UserForm from '@user/user-form'
import { canAccess } from '@utils/scopes'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from 'app/api/auth/[...nextauth]/route'

export default async function Page() {
    const session = await getServerSession(authOptions)
    if (!session || !canAccess('USERS', session.user.role))
        redirect('/protocols')
    return (
        <>
            <PageHeading title="Crear nuevo usuario" />
            <UserForm />
        </>
    )
}
