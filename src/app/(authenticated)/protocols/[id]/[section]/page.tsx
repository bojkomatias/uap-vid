import ProtocolForm from '@protocol/protocol-form-template'
import { initialSectionValues } from '@utils/createContext'
import { canExecute } from '@utils/scopes'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import { findProtocolById } from 'repositories/protocol'
import { Action, ProtocolState } from '@prisma/client'

export default async function Page({
  params,
}: {
  params: { id: string; section: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session) return

  if (params.id === 'new') {
    if (session.user.role !== 'SCIENTIST')
      return (
        <ProtocolForm
          protocol={{
            state: ProtocolState.DRAFT,
            researcherId: session.user.id,
            sections: initialSectionValues,
          }}
        />
      )
  }

  const protocol = await findProtocolById(params.id)
  if (!protocol) redirect('/protocols')

  // Allow admins to edit protocols in any state (admin override)
  const isAdmin = session.user.role === 'ADMIN'
  const canEdit =
    isAdmin ||
    canExecute(
      session.user.id === protocol.researcherId ?
        Action.EDIT_BY_OWNER
      : Action.EDIT,
      session.user.role,
      protocol.state
    )

  if (canEdit) {
    return <ProtocolForm protocol={protocol} />
  }

  redirect('/protocols')
}
