import {
  Access,
  Action,
  ProtocolState,
  ReviewType,
  ReviewVerdict,
  Role,
} from '@prisma/client'
import { getReviewsByProtocol } from '@repositories/review'
import { getAllUsersWithoutResearchers } from '@repositories/user'
import { canAccess, canExecute } from '@utils/scopes'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import { getProtocolMetadata } from '@repositories/protocol'
import { AssignEvaluatorSelector } from '@review/elements/review-assign-select'
import { EvaluatorsDialog } from '@protocol/elements/open-evaluators-dialog'

export default async function ReviewAssignation({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)
  const protocol = await getProtocolMetadata(params.id)
  if (!session || !protocol) return

  if (
    canAccess(Access.EVALUATORS, session.user.role) &&
    protocol.state !== ProtocolState.DRAFT
  ) {
    const reviews = await getReviewsByProtocol(protocol.id)
    const users = await getAllUsersWithoutResearchers()
    if (!users) return null

    const assignedInternal = reviews.find(
      (r) => r.type === ReviewType.SCIENTIFIC_INTERNAL
    )?.reviewerId
    const assignedExternal = reviews.find(
      (r) => r.type === ReviewType.SCIENTIFIC_EXTERNAL
    )?.reviewerId

    const methodologicalVerdict = reviews.find(
      (x) => x.type === ReviewType.METHODOLOGICAL
    )?.verdict

    const reviewAssignSelectsData = [
      {
        type: ReviewType.METHODOLOGICAL,
        users: users.filter(
          (u) =>
            u.role === Role.METHODOLOGIST && u.id !== protocol.researcher.id
        ),
        enabled: canExecute(
          Action.ASSIGN_TO_METHODOLOGIST,
          session.user.role,
          protocol.state
        ),
        review:
          reviews.find((review) => review.type === ReviewType.METHODOLOGICAL) ??
          null,
      },
      {
        type: ReviewType.SCIENTIFIC_INTERNAL,
        users: users.filter(
          (u) =>
            u.role === Role.SCIENTIST &&
            assignedExternal !== u.id &&
            u.id !== protocol.researcher.id
        ),
        enabled:
          canExecute(
            Action.ASSIGN_TO_SCIENTIFIC,
            session.user.role,
            protocol.state
          ) &&
          (methodologicalVerdict === ReviewVerdict.APPROVED ||
            methodologicalVerdict === ReviewVerdict.APPROVED_WITH_CHANGES),
        review:
          reviews.find(
            (review) => review.type === ReviewType.SCIENTIFIC_INTERNAL
          ) ?? null,
      },
      {
        type: ReviewType.SCIENTIFIC_EXTERNAL,
        users: users.filter(
          (u) =>
            u.role === Role.SCIENTIST &&
            assignedInternal !== u.id &&
            u.id !== protocol.researcher.id
        ),
        enabled:
          canExecute(
            Action.ASSIGN_TO_SCIENTIFIC,
            session.user.role,
            protocol.state
          ) &&
          (methodologicalVerdict === ReviewVerdict.APPROVED ||
            methodologicalVerdict === ReviewVerdict.APPROVED_WITH_CHANGES),
        review:
          reviews.find(
            (review) => review.type === ReviewType.SCIENTIFIC_EXTERNAL
          ) ?? null,
      },
      {
        type: ReviewType.SCIENTIFIC_THIRD,
        users: users.filter(
          (u) =>
            u.role === Role.SCIENTIST &&
            assignedInternal !== u.id &&
            assignedExternal !== u.id &&
            u.id !== protocol.researcher.id
        ),
        enabled:
          canExecute(
            Action.ASSIGN_TO_SCIENTIFIC,
            session.user.role,
            protocol.state
          ) &&
          reviews.filter(
            (e) =>
              (e.type === ReviewType.SCIENTIFIC_EXTERNAL ||
                e.type === ReviewType.SCIENTIFIC_INTERNAL) &&
              e.verdict !== ReviewVerdict.NOT_REVIEWED
          ).length === 2 &&
          reviews.some((e) => e.verdict === ReviewVerdict.REJECTED),
        review:
          reviews.find(
            (review) => review.type === ReviewType.SCIENTIFIC_THIRD
          ) ?? null,
      },
    ].filter((r) => r.enabled || r.review)
    // Checks if enabled to assign or re-assign, and if has review, it's data is visible (But not necessarily the action)

    return (
      <EvaluatorsDialog>
        <div className="print:hidden">
          {reviewAssignSelectsData.map(
            (data) =>
              data.enabled && (
                <AssignEvaluatorSelector
                  key={data.type}
                  type={data.type}
                  users={data.users}
                  review={data.review}
                  protocolId={protocol.id}
                  protocolState={protocol.state}
                />
              )
          )}
        </div>
      </EvaluatorsDialog>
    )
  }
}
