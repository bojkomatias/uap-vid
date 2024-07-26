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
      <div className="flex w-full flex-col items-start gap-3 lg:flex-row print:hidden">
        <div className="flex-grow">
          {/* {metadata} */}
          {/* {evaluators} */}
        </div>
        {/* {actions}
        {modal} */}
      </div>

      <div className="relative mt-8 grid grid-cols-1 gap-8 lg:grid-cols-10">
        <aside
          className={cx(
            'col-span-4 space-y-2 overflow-y-auto rounded-r-lg bg-gray-500/5 lg:sticky lg:-top-8 lg:-mb-8 lg:-ml-8 lg:-mr-4 lg:-mt-8 lg:h-[100svh] lg:px-4 lg:py-8',
            (protocol.state === ProtocolState.DRAFT ||
              protocol.state === ProtocolState.PUBLISHED) &&
              'hidden'
          )}
        >
          {reviews}
        </aside>
        <div className="col-span-6">{children}</div>
      </div>
    </>
  )
}

export default Layout
