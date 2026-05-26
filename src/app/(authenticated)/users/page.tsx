import { getUsers } from '@repositories/user'
import UserTable from '@user/user-table'
import { Heading, Subheading } from '@components/heading'
import { NewUserDialog } from '@user/new-user-dialog'
import { ContainerAnimations } from '@elements/container-animations'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>
}) {
  const resolvedSearchParams = await searchParams
  const [totalRecords, users] = await getUsers(resolvedSearchParams)

  return (
    <>
      <ContainerAnimations duration={0.4} delay={0}>
        <div className="flex items-end">
          <Heading>Lista de usuarios</Heading>
          <NewUserDialog />
        </div>
        <Subheading>
          Los usuarios que fueron dados de alta o alguna vez ingresaron al
          sistema. Aquí puede re asignar los roles de los mismos y visualizar
          sus datos.
        </Subheading>
      </ContainerAnimations>
      <ContainerAnimations duration={0.3} delay={0.1} animation={2}>
        <UserTable users={users} totalRecords={totalRecords} />
      </ContainerAnimations>
    </>
  )
}
