import { Action, ReviewVerdict, Prisma } from '@prisma/client'
import { ActionsDropdown } from '@protocol/elements/actions-dropdown'
import { findProtocolByIdWithResearcher } from '@repositories/protocol'
import { getReviewsByProtocol } from '@repositories/review'
import { getActionsByRoleAndState, canExecute } from '@utils/scopes'
import { ProtocolSchema } from '@utils/zod'

import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import { getServerSession } from 'next-auth'
import { ProtocolStatesDictionary } from '@utils/dictionaries/ProtocolStatesDictionary'

type ProtocolWithResearcher = Prisma.ProtocolGetPayload<{
  include: {
    researcher: { select: { id: true; name: true; email: true } }
    convocatory: { select: { id: true; name: true } }
    anualBudgets: {
      select: { createdAt: true; year: true; id: true; state: true }
    }
    flags: true
  }
}>

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
  const isAdmin = session.user.role === 'ADMIN'
  const isOwner = session.user.id === protocol.researcherId

  // Check results for admin override
  const checkResults = {
    publish: {
      isValid: false,
      hasConvocatory: false,
      message: '',
    },
    accept: {
      allReviewed: false,
      message: '',
    },
    approve: {
      allFlagsValid: false,
      hasRequiredFlags: false,
      message: '',
    },
    edit: {
      canEdit: false,
      message: '',
    },
  }

  // Edit by owner
  if (
    !actions.includes(Action.EDIT) &&
    actions.includes(Action.EDIT_BY_OWNER)
  ) {
    if (session.user.id === protocol.researcherId)
      filteredActions.push(Action.EDIT) // I only check for edit in Dropdown, but add it only if is owner.
  }

  // --- Checks for Publish, Accept, and Approve actions ---

  // Publish
  const validToPublish = ProtocolSchema.safeParse(protocol)
  checkResults.publish.isValid = validToPublish.success
  checkResults.publish.hasConvocatory = !!protocol.convocatoryId
  if (!validToPublish.success) {
    checkResults.publish.message =
      'El protocolo no está completo. Debe completar todas las secciones y los campos requeridos.'
  } else if (!protocol.convocatoryId) {
    checkResults.publish.message =
      'El protocolo no tiene una convocatoria asignada.'
  }
  const publishChecksFailed =
    !checkResults.publish.isValid || !checkResults.publish.hasConvocatory

  // Accept
  const hasUnreviewed = reviews.some(
    (review) => review.verdict === ReviewVerdict.NOT_REVIEWED
  )
  const hasReviews = reviews.length > 0
  checkResults.accept.allReviewed = hasReviews && !hasUnreviewed
  if (!hasReviews) {
    checkResults.accept.message =
      'No hay evaluaciones asignadas al protocolo. Debe asignar al menos un evaluador antes de aceptar el protocolo.'
  } else if (hasUnreviewed) {
    checkResults.accept.message =
      'No todas las evaluaciones han sido completadas. Algunas evaluaciones aún están pendientes.'
  }

  // Approve
  const hasInvalidFlags = protocol.flags.some((flag) => flag.state === false)
  const hasRequiredFlags = protocol.flags.length >= 2
  checkResults.approve.allFlagsValid = !hasInvalidFlags
  checkResults.approve.hasRequiredFlags = hasRequiredFlags
  if (hasInvalidFlags) {
    checkResults.approve.message =
      'Alguno de los votos del protocolo no están aprobadas.'
  } else if (!hasRequiredFlags) {
    checkResults.approve.message =
      'El protocolo no tiene los votos requeridos (se necesitan al menos 2).'
  }
  const approveChecksFailed = hasInvalidFlags || !hasRequiredFlags

  // Edit
  const canEditNormally = canExecute(
    session.user.id === protocol.researcherId ?
      Action.EDIT_BY_OWNER
    : Action.EDIT,
    session.user.role,
    protocol.state,
    session.user.id,
    protocol.researcherId
  )
  checkResults.edit.canEdit = canEditNormally
  if (!canEditNormally) {
    checkResults.edit.message = `El protocolo está en estado "${ProtocolStatesDictionary[protocol.state]}" y no puede ser editado normalmente. Solo los administradores pueden editar protocolos en este estado.`
  }

  // --- Global Rule: Filter out elevated actions for elevated roles on their own protocols ---
  // Elevated roles (SECRETARY, METHODOLOGIST, SCIENTIST) cannot perform privileged actions on their own protocols
  // Filter each action through canExecute with ownership parameters
  if (!isAdmin && isOwner) {
    filteredActions = filteredActions.filter((action) =>
      canExecute(
        action,
        session.user.role,
        protocol.state,
        session.user.id,
        protocol.researcherId
      )
    )
  }

  // --- Admin Override Logic: Add actions back if missing ---
  // --- Non-Admin Logic: Filter out actions if checks fail ---

  if (isAdmin) {
    // For Admins, if the action is not in the list due to state or a failed check, add it.
    if (!actions.includes(Action.PUBLISH) || publishChecksFailed) {
      if (!filteredActions.includes(Action.PUBLISH))
        filteredActions.push(Action.PUBLISH)
    }
    if (!actions.includes(Action.ACCEPT) || hasUnreviewed) {
      if (!filteredActions.includes(Action.ACCEPT))
        filteredActions.push(Action.ACCEPT)
    }
    if (!actions.includes(Action.APPROVE) || approveChecksFailed) {
      if (!filteredActions.includes(Action.APPROVE))
        filteredActions.push(Action.APPROVE)
    }
    // For Admins, always ensure EDIT action is available
    if (!filteredActions.includes(Action.EDIT)) {
      filteredActions.push(Action.EDIT)
    }
  } else {
    // For non-Admins, filter out actions if they were allowed by state but fail business logic checks.
    if (publishChecksFailed) {
      filteredActions = filteredActions.filter((e) => e !== Action.PUBLISH)
    }
    if (hasUnreviewed) {
      filteredActions = filteredActions.filter((e) => e !== Action.ACCEPT)
    }
    if (approveChecksFailed) {
      filteredActions = filteredActions.filter((e) => e !== Action.APPROVE)
    }
  }

  return (
    <ActionsDropdown
      actions={filteredActions}
      protocol={protocol}
      canViewLogs={session.user.role === 'ADMIN'}
      userRole={session.user.role}
      checkResults={checkResults}
    />
  )
}
