import { findUserById } from '@repositories/user'
import { UserDetailsDialog } from '@user/user-details-dialog'
import { redirect } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await findUserById(id)
  if (!data) redirect('/users')
  const { password, ...user } = data

  return <UserDetailsDialog user={user} />
}
