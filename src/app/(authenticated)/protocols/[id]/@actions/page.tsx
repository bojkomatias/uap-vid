import { Action } from '@prisma/client'
import { ActionsDropdown } from '@protocol/elements/actions-dropdown'
import { BudgetDropdown } from '@protocol/elements/budgets/budget-dropdown'
import { findProtocolByIdWithResearcher } from '@repositories/protocol'
import { getReviewsByProtocol } from '@repositories/review'
import { canExecute, getActionsByRoleAndState } from '@utils/scopes'
import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import { getServerSession } from 'next-auth'

export default async function ActionsPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)
  const protocol = await findProtocolByIdWithResearcher(params.id)
  if (!protocol || !session) return
  const reviews = await getReviewsByProtocol(protocol.id)

  const actions = getActionsByRoleAndState(session.user.role, protocol.state)

  console.log(actions)

  return (
    <>
      <ActionsDropdown
        actions={actions}
        protocolId={protocol.id}
        protocolState={protocol.state}
        userId={session.user.id}
        canEdit={canExecute(
          session.user.id === protocol.researcherId ?
            Action.EDIT_BY_OWNER
          : Action.EDIT,
          session.user.role,
          protocol.state
        )}
      />
      {canExecute(
        Action.VIEW_ANUAL_BUDGET,
        session.user.role,
        protocol.state
      ) &&
        protocol.anualBudgets.length > 0 && (
          <BudgetDropdown budgets={protocol.anualBudgets} />
        )}
    </>
  )
}
