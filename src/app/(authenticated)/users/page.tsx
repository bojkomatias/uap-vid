import Link from 'next/link'
import { getUsers } from '@repositories/user'
import { PageHeading } from '@layout/page-heading'
import { UserPlus } from 'tabler-icons-react'
import UserTable from '@user/user-table'
import { buttonStyle } from '@elements/button/styles'

export default async function Page({
    searchParams,
}: {
    searchParams: { [key: string]: string }
}) {
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
                    Nuevo usuario
                </Link>
            </div>
            <UserTable users={users} totalRecords={totalRecords} />
        </>
    )
}
