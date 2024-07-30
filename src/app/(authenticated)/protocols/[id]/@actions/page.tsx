import { Action, ReviewVerdict } from '@prisma/client'
import { ActionsDropdown } from '@protocol/elements/actions-dropdown'
import { BudgetDropdown } from '@protocol/elements/budgets/budget-dropdown'
import { findProtocolByIdWithResearcher } from '@repositories/protocol'
import { getReviewsByProtocol } from '@repositories/review'
import { canExecute, getActionsByRoleAndState } from '@utils/scopes'
import { ProtocolSchema } from '@utils/zod'
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

  // Edit by owner
  if (!actions.includes('EDIT') && actions.includes('EDIT_BY_OWNER')) {
    if (session.user.id === protocol.researcherId) actions.push('EDIT') // I only check for edit in Dropdown, but add it only if is owner.
  }
  // Publish only if valid
  if (actions.includes('PUBLISH')) {
    const validToPublish = ProtocolSchema.safeParse(protocol)
    if (!validToPublish.success) actions.filter((e) => e !== 'PUBLISH')
  }
  // Accept only if review have correct verdicts
  if (actions.includes('ACCEPT')) {
    if (reviews.some((review) => review.verdict === ReviewVerdict.NOT_REVIEWED))
      actions.filter((e) => e !== 'ACCEPT')
  }

  return (
    <>
      <ActionsDropdown
        actions={actions}
        protocolId={protocol.id}
        protocolState={protocol.state}
        userId={session.user.id}
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
