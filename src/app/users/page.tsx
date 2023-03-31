import Link from 'next/link'
import { Button } from '@elements/custom-button'
import { getAllUsers } from 'repositories/users'
import { PageHeading } from '@layout/page-heading'
import { UserPlus } from 'tabler-icons-react'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { canAccess } from '@utils/scopes'
import { redirect } from 'next/navigation'
import UserTable from '@user/user-table'

export default async function UserList() {
    const session = await getServerSession(authOptions)

    if (!canAccess('USERS', session?.user?.role!)) redirect('/protocols')
    const users = await getAllUsers()

    return (
        <>
            <PageHeading title="Lista de usuarios" />
            <div className="flex flex-row-reverse">
                <Link href={'/users/new'} passHref>
                    <Button intent="secondary">
                        <UserPlus className="h-5" />
                        <span className="ml-3"> Nuevo usuario</span>
                    </Button>
                </Link>
            </div>

            <UserTable users={users!} />
        </>
    )
}
