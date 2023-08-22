import Link from 'next/link'
import { getUsers } from '@repositories/user'
import { PageHeading } from '@layout/page-heading'
import { UserPlus } from 'tabler-icons-react'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/[...nextauth]/route'
import { canAccess } from '@utils/scopes'
import { redirect } from 'next/navigation'
import UserTable from '@user/user-table'
import { buttonStyle } from '@elements/button/styles'

export default async function Page({
    searchParams,
}: {
    searchParams: { [key: string]: string }
}) {
    const session = await getServerSession(authOptions)
    if (!session) return
    if (!canAccess('USERS', session.user.role)) redirect('/protocols')

    const [totalRecords, users] = await getUsers(searchParams)

    return (
        <>
            <PageHeading title="Lista de usuarios" />
            <div className="flex flex-row-reverse">
                <Link
                    href={'/users/new'}
                    className={buttonStyle('secondary')}
                    passHref
                >
                    <UserPlus className="h-5 text-current" />
                    <span> Nuevo usuario</span>
                </Link>
            </div>
            <UserTable
                loggedInUser={session.user}
                users={users}
                totalRecords={totalRecords}
            />
        </>
    )
}
