import { getUsers } from '@repositories/user'
import UserTable from '@user/user-table'
import { Heading } from '@components/heading'
import { NewUserDialog } from '@user/new-user-dialog'

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}) {
  const [totalRecords, users] = await getUsers(searchParams)

  return (
    <>
      <div className="flex items-end">
        <Heading>Lista de usuarios</Heading>
        <NewUserDialog />
      </div>

      <UserTable users={users} totalRecords={totalRecords} />
    </>
  )
}
