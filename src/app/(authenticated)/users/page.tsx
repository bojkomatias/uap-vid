import Link from 'next/link'
import { Button } from '@elements/button'
import { getAllUsers, totalUserRecords } from '@repositories/user'
import { PageHeading } from '@layout/page-heading'
import { UserPlus } from 'tabler-icons-react'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { canAccess } from '@utils/scopes'
import { redirect } from 'next/navigation'
import UserTable from '@user/user-table'
import Pagination from '@elements/pagination'
import fuzzysort from 'fuzzysort'
import type { User } from '@prisma/client'
import SearchBar from '@elements/search-bar'

export default async function UserList({
    searchParams,
}: {
    searchParams?: { [key: string]: string }
}) {
    const session = await getServerSession(authOptions)
    if (!session) return
    if (!canAccess('USERS', session.user.role)) redirect('/protocols')
    const shownRecords = 8
    const users = await getAllUsers(
        shownRecords,
        Number(searchParams?.page) || 1
    )
    const userCount = await totalUserRecords()

    const searchedUsers = searchParams?.search
        ? fuzzysort
              .go(searchParams.search, users as User[], {
                  keys: ['name', 'role', 'email'],
              })
              .map((result) => {
                  return result.obj as User
              })
        : users

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
            <SearchBar
                url="/users"
                placeholderMessage="Buscar usuario por nombre, rol o email"
            />

            <UserTable users={searchedUsers!} />
            {searchParams?.search ? null : (
                <Pagination
                    url="/users"
                    pageParams={Number(searchParams?.page) || 1}
                    count={userCount!}
                    shownRecords={shownRecords}
                />
            )}
        </>
    )
}
