import { canAccess, canExecute } from '@utils/scopes'
import { getServerSession } from 'next-auth'
import { type ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import { getProtocolMetadata } from '@repositories/protocol'
import { Access, Action, ProtocolState, ReviewVerdict } from '@prisma/client'
import { Heading } from '@components/heading'
import { ChatFullComponent } from 'modules/chat/ChatFullComponent'
import { cx } from '@utils/cx'
import { ReviewFormTemplate } from '@review/review-form-template'
import { ReviewList } from '@review/elements/review-list'
import { getReviewsByProtocol } from '@repositories/review'
import { ProtocolMetadata } from '@protocol/elements/protocol-metadata'

export default async function Layout({
  params,
  evaluators,
  actions,
  modal,
  children,
}: {
  params: { id: string }
  evaluators: ReactNode
  actions: ReactNode
  modal: ReactNode
  children: ReactNode
}) {
  const session = await getServerSession(authOptions)
  if (!session) return
  if (params.id === 'new') {
    if (
      !canExecute(Action.CREATE, session.user.role, ProtocolState.NOT_CREATED)
    )
      redirect('/protocols')
    return (
      <>
        <Heading>Nuevo protocolo</Heading>
        {children}
      </>
    )
  }
  const protocol = await getProtocolMetadata(params.id)
  if (!protocol) redirect('/protocols')

  const reviews = await getReviewsByProtocol(params.id)

  const isReviewListShown =
    reviews &&
    reviews.some((r) => r.verdict !== ReviewVerdict.NOT_REVIEWED) &&
    (session.user.id === protocol.researcher.id ||
      canAccess(Access.REVIEWS, session.user.role))

  const isReviewFormShown = canExecute(
    Action.REVIEW,
    session.user.role,
    protocol.state
  )

  return (
    <>
      <ProtocolMetadata params={params} />

      <div className="flex w-full flex-col items-start gap-3 lg:flex-row print:hidden">
        <div className="flex-grow">
          {/* {metadata} */}
          {/* {evaluators} */}
        </div>
        {/* {actions}
        {modal} */}
      </div>

      <div className="relative mt-8 gap-8 lg:grid lg:grid-cols-10">
        {/* Review form */}
        {isReviewFormShown && (
          <aside
            className={cx(
              'col-span-4 -m-6 space-y-2 overflow-y-auto bg-gray-200/50 p-6 dark:bg-gray-800/50 lg:sticky lg:-top-8 lg:-mb-8 lg:-ml-8 lg:-mr-4 lg:-mt-8 lg:h-[100svh] lg:rounded-r-lg lg:px-4 lg:pb-8 lg:pt-8'
            )}
          >
            <ReviewFormTemplate
              protocolId={protocol.id}
              userId={session.user.id}
            />
          </aside>
        )}
        {/* Review list */}
        {isReviewListShown && (
          <aside className="col-span-4 -m-6 space-y-2 overflow-y-auto bg-gray-200/50 p-6 dark:bg-gray-800/50 lg:sticky lg:-top-8 lg:-mb-8 lg:-ml-8 lg:-mr-4 lg:-mt-8 lg:h-[100svh] lg:rounded-r-lg lg:px-4 lg:pb-8 lg:pt-8">
            <ReviewList
              role={session.user.role}
              id={protocol.id}
              isOwner={session.user.id === protocol.researcher.id}
            />
          </aside>
        )}

        {/* Protocol page */}
        <div
          className={cx(
            'mt-12 lg:mt-0',
            isReviewListShown || isReviewFormShown ? 'col-span-6' : (
              'col-span-full'
            )
          )}
        >
          {children}
        </div>
      </div>

      <ChatFullComponent user={session.user} protocolId={protocol.id} />
    </>
  )
}
