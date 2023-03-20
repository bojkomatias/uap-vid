import UserForm from '@admin/UserForm'
import Navigation from '@auth/Navigation'
import { Heading } from '@layout/Heading'
import { canAccess } from '@utils/scopes'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from 'pages/api/auth/[...nextauth]'

export default async function Page() {
    const session = await getServerSession(authOptions)
    if (!canAccess('USERS', session?.user?.role!)) redirect('/')
    return (
        <>
            <Heading title="Crear nuevo usuario" />
            <UserForm />
        </>
    )
}
