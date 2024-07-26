import { canExecute } from '@utils/scopes'
import { getServerSession } from 'next-auth'
import { type ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import { getProtocolMetadata } from '@repositories/protocol'
import { Action, ProtocolState } from '@prisma/client'
import { Heading } from '@components/heading'
import { ChatFullComponent } from 'modules/chat/ChatFullComponent'
import { cx } from '@utils/cx'
import { Divider } from '@components/divider'

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
      </div>

      <div className="relative mt-8 gap-8 lg:grid lg:grid-cols-10">
        <aside
          className={cx(
            'col-span-4 -m-6 space-y-2 overflow-y-auto bg-gray-500/5 p-6 lg:sticky lg:-top-8 lg:-mb-8 lg:-ml-8 lg:-mr-4 lg:-mt-8 lg:h-[100svh] lg:rounded-r-lg lg:px-4 lg:pb-8 lg:pt-8',
            (protocol.state === ProtocolState.DRAFT ||
              protocol.state === ProtocolState.PUBLISHED) &&
              'hidden'
          )}
        >
          {reviews}
        </aside>

        <div className="col-span-6 mt-12 lg:mt-0">{children}</div>
      </div>

      <ChatFullComponent user={session.user} protocolId={protocol.id} />
    </>
  )
}

export default Layout
