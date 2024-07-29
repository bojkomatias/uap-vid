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
import HideReviewsButton from '@protocol/elements/hide-reviews-button'
import { ContainerAnimations } from '@elements/container-animations'
import ContextMenu from '../../../../shared/context-menu'

import FlagsDialog from '@protocol/elements/flags/flags-dialog'
import { BadgeButton } from '@components/badge'
import { Mail } from 'tabler-icons-react'
import ProtocolNumberUpdate from '@protocol/elements/protocol-number-update'
import ProtocolLogsDrawer from '@protocol/elements/logs/log-drawer'

async function Layout({
  params,
  metadata,
  evaluators,
  actions,
  modal,
  children,
}: {
  params: { id: string }
  metadata: ReactNode
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
    <ContextMenu
      context={{
        protocol_id: protocol.id,
        user: session.user,
      }}
      menu={
        <>
          <ProtocolNumberUpdate
            context_menu
            role={session.user.role}
            protocolId={protocol.id}
            protocolNumber={protocol.protocolNumber}
          />
          <BadgeButton
            href={`mailto:${protocol.researcher.email}`}
            className="flex grow justify-between gap-2 shadow-sm"
          >
            Enviar email al investigador <Mail size={18} />
          </BadgeButton>
          <FlagsDialog
            protocolFlags={protocol.flags}
            protocolId={protocol.id}
            context_menu={true}
          />
          <ProtocolLogsDrawer
            protocolId={protocol.id}
            context_menu
            userId={session.user.id}
          />
        </>
      }
    >
      <ProtocolMetadata params={params} />

      <div className="flex w-full flex-col items-start gap-3 lg:flex-row print:hidden">
        <div className="flex-grow">
          {/* {metadata} */}
          {/* {evaluators} */}
        </div>
        {/* {actions}
        {modal} */}
      </div>
      {reviews.length > 0 && (
        <ContainerAnimations animation={1} duration={0.2} delay={0.1}>
          <HideReviewsButton />
        </ContainerAnimations>
      )}
      <div
        id="protocol-and-reviews-container"
        className="relative mt-8 grid-cols-1 gap-8 lg:grid lg:grid-cols-10 "
      >
        {/* Review form */}
        {isReviewFormShown && (
          <aside
            id="reviews-form-container"
            className={cx(
              'col-span-4 -m-6 space-y-2 overflow-y-auto bg-gray-200/75 p-6 dark:bg-gray-800/90 lg:sticky lg:-top-8 lg:-mb-8 lg:-ml-8 lg:-mr-4 lg:-mt-8 lg:h-[100svh] lg:rounded-r-lg lg:px-4 lg:pb-8 lg:pt-8 print:hidden'
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
          <ContainerAnimations
            id="reviews-container"
            className="col-span-4 -m-6 space-y-2 overflow-y-auto  bg-gray-200/75 p-6 transition dark:bg-gray-800/90 lg:sticky lg:-top-8  lg:-mb-8 lg:-ml-8 lg:-mr-4 lg:-mt-8 lg:h-[100svh] lg:rounded-r-lg lg:px-4 lg:pb-8 lg:pt-8 print:hidden"
            animation={4}
            duration={0.2}
            delay={0.1}
          >
            <ReviewList
              role={session.user.role}
              id={protocol.id}
              isOwner={session.user.id === protocol.researcher.id}
            />
          </ContainerAnimations>
        )}

        {/* Protocol page */}
        <div
          id="protocol-container"
          className={cx(
            'mt-12 transition lg:mt-0',
            isReviewListShown || isReviewFormShown ? 'col-span-6' : (
              'col-span-full'
            )
          )}
        >
          {children}
        </div>
      </div>

      <ChatFullComponent user={session.user} protocolId={protocol.id} />
    </ContextMenu>
  )
}

export default Layout
