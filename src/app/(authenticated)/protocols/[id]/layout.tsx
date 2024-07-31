import { canAccess, canExecute } from '@utils/scopes'
import { getServerSession } from 'next-auth'
import { type ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import { getProtocolMetadata } from '@repositories/protocol'
import { Access, Action, ReviewVerdict } from '@prisma/client'
import { Heading } from '@components/heading'
import { ChatFullComponent } from 'modules/chat/ChatFullComponent'
import { cx } from '@utils/cx'
import { ReviewFormTemplate } from '@review/review-form-template'
import { ReviewList } from '@review/elements/review-list'
import { getReviewsByProtocol } from '@repositories/review'
import { ProtocolMetadata } from '@protocol/elements/protocol-metadata'
import { ContainerAnimations } from '@elements/container-animations'
import ContextMenu from '../../../../shared/context-menu'
import FlagsDialog from '@protocol/elements/flags/flags-dialog'
import { BadgeButton } from '@components/badge'
import { Mail } from 'tabler-icons-react'
import ProtocolNumberUpdate from '@protocol/elements/protocol-number-update'
import ProtocolLogsDrawer from '@protocol/elements/logs/log-drawer'
import { ReviewDisclose } from '@review/review-disclose'

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
    if (session.user.role === 'SCIENTIST') redirect('/protocols')
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
      {modal}
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
        <ProtocolMetadata
          params={params}
          actions={actions}
          evaluators={evaluators}
        />
        {evaluators}

        <div className="h-[98svh] xl:relative">
          <ContainerAnimations
            animation={4}
            duration={0.2}
            id="reviews-container"
            className={cx(
              'bottom-0 left-0 right-2/3 top-0 mb-8 overflow-x-auto overflow-y-auto rounded-lg bg-gray-500/5 p-4 transition-all duration-300 ease-in-out xl:absolute xl:-mb-8 xl:-ml-8 xl:mr-4 xl:mt-6 xl:rounded-tr-xl xl:pb-8 xl:pl-8 xl:pr-4 xl:pt-4 print:hidden',
              isReviewFormShown || isReviewListShown ? '' : 'hidden'
            )}
          >
            {isReviewFormShown && (
              <ReviewFormTemplate
                protocolId={protocol.id}
                userId={session.user.id}
              />
            )}
            {isReviewListShown && (
              <ReviewList
                role={session.user.role}
                id={protocol.id}
                isOwner={session.user.id === protocol.researcher.id}
              />
            )}
          </ContainerAnimations>
          <ContainerAnimations
            animation={2}
            duration={0.2}
            id="protocol-container"
            className={cx(
              'inset-0 space-y-6 overflow-y-auto transition-all duration-300 ease-in-out @container xl:absolute xl:-mb-8 xl:py-8 print:left-full',
              isReviewFormShown || isReviewListShown ? 'left-1/3' : ''
            )}
          >
            {children}
          </ContainerAnimations>
          {isReviewFormShown || isReviewListShown ?
            <ContainerAnimations
              delay={0.5}
              className="absolute left-0 top-0 z-10 -mt-6 hidden xl:block"
            >
              <ReviewDisclose />
            </ContainerAnimations>
          : null}
        </div>

        <ChatFullComponent user={session.user} protocolId={protocol.id} />
      </ContextMenu>
    </>
  )
}
