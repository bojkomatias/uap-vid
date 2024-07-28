import { getUsers } from '@repositories/user'
import UserTable from '@user/user-table'
import { Heading } from '@components/heading'
import { NewUserDialog } from '@user/new-user-dialog'
import { ContainerAnimations } from '@elements/container-animations'

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}) {
  const [totalRecords, users] = await getUsers(searchParams)

  return (
    <>
      <ContainerAnimations duration={0.4} delay={0}>
        <div className="flex items-end">
          <Heading>Lista de usuarios</Heading>
          <NewUserDialog />
        </div>
      </ContainerAnimations>
      <ContainerAnimations duration={0.3} delay={0.1} animation={2}>
        <UserTable users={users} totalRecords={totalRecords} />
      </ContainerAnimations>
    </>
  )
}
