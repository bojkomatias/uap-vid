import { State } from '@prisma/client'
import { getProtocolMetadata } from '@repositories/protocol'
import ReviewList from '@review/elements/review-list'
import ReviewFormTemplate from '@review/review-form-template'
import { cx } from '@utils/cx'
import { canExecute, canAccess } from '@utils/scopes'
import { ACCESS, ACTION } from '@utils/zod'
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
        <aside
            className={cx(
                'min-w-fit space-y-3 overflow-y-auto py-3 pl-4 pr-1 lg:sticky lg:top-0 lg:h-screen lg:pl-0',
                (protocol.state === State.DRAFT ||
                    protocol.state === State.PUBLISHED) &&
                    'hidden'
            )}
        >
            {session.user.id !== protocol.researcher.id &&
            canExecute(ACTION.REVIEW, session.user.role, protocol.state) ? (
                <ReviewFormTemplate
                    protocolId={protocol.id}
                    userId={session.user.id}
                />
            ) : null}

            {session.user.id === protocol.researcher.id ||
            canAccess(ACCESS.REVIEWS, session.user.role) ? (
                <ReviewList
                    role={session.user.role}
                    id={protocol.id}
                    isOwner={session.user.id === protocol.researcher.id}
                />
            ) : null}
        </aside>
    )
}
