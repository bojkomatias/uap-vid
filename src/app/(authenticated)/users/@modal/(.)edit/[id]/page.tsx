import { findUserById } from '@repositories/user'
import { UserDetailsDialog } from '@user/user-details-dialog'
import { redirect } from 'next/navigation'

export default async function Page({ params }: { params: { id: string } }) {
  const data = await findUserById(params.id)
  if (!data) redirect('/users')
  const { password, ...user } = data

  return <UserDetailsDialog user={user} />
}
