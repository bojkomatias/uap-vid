import { Access, Action, ProtocolState } from '@prisma/client'
import { getProtocolMetadata } from '@repositories/protocol'
import { ReviewList } from '@review/elements/review-list'
import ReviewFormTemplate from '@review/review-form-template'
import { cx } from '@utils/cx'
import { canAccess, canExecute } from '@utils/scopes'
import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import { getServerSession } from 'next-auth'

export default async function ReviewsPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)
  const protocol = await getProtocolMetadata(params.id)
  if (!session || !protocol) return

  return (
    <>
      {(
        session.user.id !== protocol.researcher.id &&
        canExecute(Action.REVIEW, session.user.role, protocol.state)
      ) ?
        <ReviewFormTemplate protocolId={protocol.id} userId={session.user.id} />
      : null}

      {(
        session.user.id === protocol.researcher.id ||
        canAccess(Access.REVIEWS, session.user.role)
      ) ?
        <ReviewList
          role={session.user.role}
          id={protocol.id}
          isOwner={session.user.id === protocol.researcher.id}
        />
      : null}
    </>
  )
}
