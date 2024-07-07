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
import { UserSearch } from 'tabler-icons-react'
import { Badge } from '@components/badge'
import { canAccess, canExecute } from '@utils/scopes'
import { EvaluatorsByReviewType } from '@utils/dictionaries/EvaluatorsDictionary'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import { getProtocolMetadata } from '@repositories/protocol'
import ReviewAssignSelect from '@review/elements/review-assign-select'

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
      <div className="relative z-10 my-1 ml-2 max-w-3xl rounded bg-gray-50/50 px-3 py-2 leading-relaxed drop-shadow-sm">
        {reviewAssignSelectsData.map((data) => (
          <div
            key={data.type}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2">
              <UserSearch className="h-4 text-gray-600" />
              <div className="flex-grow text-sm font-medium">
                {data.review?.reviewer.name ?? (
                  <span className="text-sm text-gray-500">-</span>
                )}
              </div>
              <Badge>{EvaluatorsByReviewType[data.type]}</Badge>
            </div>
            {data.enabled && (
              <ReviewAssignSelect
                {...data}
                protocolId={protocol.id}
                protocolState={protocol.state}
              />
            )}
          </div>
        ))}
      </div>
    )
  }
}
