import { Heading } from '@components/heading'
import UserForm from '@user/user-form'

export default async function Page() {
  return (
    <>
      <Heading> Crear nuevo usuario</Heading>
      <UserForm />
    </>
  )
}
