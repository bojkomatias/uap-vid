import { Heading, Subheading } from '@components/heading'
import { DuplicateUsersManager } from 'modules/users/duplicate-users-manager'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import { Role } from '@prisma/client'
import { redirect } from 'next/navigation'

export default async function DuplicateUsersPage() {
  const session = await getServerSession(authOptions)

  // Only admins can access this page
  if (!session || session.user.role !== Role.ADMIN) {
    redirect('/protocols')
  }

  return (
    <>
      <Heading>Usuarios Duplicados</Heading>
      <Subheading className="mb-6">
        Detecta y fusiona cuentas de usuario duplicadas basadas en el email.
      </Subheading>

      <DuplicateUsersManager />
    </>
  )
}
