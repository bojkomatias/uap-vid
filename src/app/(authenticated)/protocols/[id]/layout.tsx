import { canExecute } from '@utils/scopes'
import { getServerSession } from 'next-auth'
import { type ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import { getProtocolMetadata } from '@repositories/protocol'
import { Action, ProtocolState } from '@prisma/client'
import { Heading } from '@components/heading'
import { PDF } from 'modules/protocol-pdf'
import { ChatFullComponent } from 'modules/chat/ChatFullComponent'

async function Layout({
  params,
  metadata,
  evaluators,
  actions,
  reviews,
  modal,
  children,
}: {
  params: { id: string }
  metadata: ReactNode
  evaluators: ReactNode
  actions: ReactNode
  reviews: ReactNode
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

  return (
    <>
      <Heading title={protocol.sections.identification.title}>
        {protocol.sections.identification.title}
      </Heading>
      <div className="flex w-full flex-col items-start gap-3 lg:flex-row">
        <div className="flex-grow">
          {metadata}
          {evaluators}
        </div>
        {actions}
        {modal}
        <PDF />
      </div>

      <div className="relative z-0 flex flex-col-reverse gap-10 py-6 lg:flex-row lg:gap-4">
        <div className="w-full">{children}</div>
        {reviews}
      </div>

      <ChatFullComponent user={session.user} protocolId={protocol.id} />
    </>
  )
}

export default Layout
