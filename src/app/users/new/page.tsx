import { Heading } from '@layout/Heading'
import UserForm from '@user/UserForm'
import { canAccess } from '@utils/scopes'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from 'pages/api/auth/[...nextauth]'

export default async function Page() {
    const session = await getServerSession(authOptions)
    if (!canAccess('USERS', session?.user?.role!)) redirect('/protocols')
    return (
        <>
            <Heading title="Crear nuevo usuario" />
            <UserForm />
        </>
    )
}
