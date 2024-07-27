import { canExecute } from '@utils/scopes'
import { getServerSession } from 'next-auth'
import { type ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import { getProtocolMetadata } from '@repositories/protocol'
import { Action, ProtocolState } from '@prisma/client'
import { Heading } from '@components/heading'

export default async function Layout({
  params,
  evaluators,
  actions,
  reviews,
  modal,
  children,
}: {
  params: { id: string }
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

      <div className="relative z-0 flex flex-col-reverse lg:flex-row lg:gap-2 lg:divide-x print:block print:py-2 ">
        <div className="w-full">{children}</div>
        <div className="print:hidden">{reviews}</div>
      </div>
    </>
  )
}
