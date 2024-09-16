import { Action, ReviewVerdict } from '@prisma/client'
import { ActionsDropdown } from '@protocol/elements/actions-dropdown'
import { findProtocolByIdWithResearcher } from '@repositories/protocol'
import { getReviewsByProtocol } from '@repositories/review'
import { getActionsByRoleAndState } from '@utils/scopes'
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
  let filteredActions = actions

  // Edit by owner
  if (
    !actions.includes(Action.EDIT) &&
    actions.includes(Action.EDIT_BY_OWNER)
  ) {
    if (session.user.id === protocol.researcherId)
      filteredActions.push(Action.EDIT) // I only check for edit in Dropdown, but add it only if is owner.
  }
  // Publish only if valid
  if (actions.includes(Action.PUBLISH)) {
    const validToPublish = ProtocolSchema.safeParse(protocol)
    if (!validToPublish.success || !protocol.convocatoryId)
      filteredActions = filteredActions.filter((e) => e !== Action.PUBLISH)
  }
  // Accept only if review have correct verdicts
  if (actions.includes(Action.ACCEPT)) {
    if (reviews.some((review) => review.verdict === ReviewVerdict.NOT_REVIEWED))
      filteredActions = filteredActions.filter((e) => e !== Action.ACCEPT)
  }
  //  Approve only if has both protocol flags and review flags
  if (actions.includes(Action.APPROVE)) {
    if (
      protocol.flags.some((flag) => flag.state === false) ||
      protocol.flags.length < 2
    )
      filteredActions = filteredActions.filter((e) => e !== Action.APPROVE)
  }

  return (
    <ActionsDropdown
      actions={filteredActions}
      protocol={protocol}
      canViewLogs={session.user.role === 'ADMIN'}
    />
  )
}
