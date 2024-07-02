import { getUsers } from '@repositories/user'
import { UserPlus } from 'tabler-icons-react'
import UserTable from '@user/user-table'
import { Heading } from '@components/heading'
import { Button } from '@components/button'

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
        <Button href={'/users/new'}>
          <UserPlus data-slot="icon" />
          Nuevo usuario
        </Button>
      </div>

      <UserTable users={users} totalRecords={totalRecords} />
    </>
  )
}
