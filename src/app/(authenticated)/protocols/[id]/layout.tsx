import { PageHeading } from '@layout/page-heading'
import { canExecute } from '@utils/scopes'
import { getServerSession } from 'next-auth'
import { type ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { authOptions } from 'app/api/auth/[...nextauth]/route'
import { getProtocolMetadata } from '@repositories/protocol'

async function Layout({
    params,
    metadata,
    evaluators,
    actions,
    reviews,
    children,
}: {
    params: { id: string }
    metadata: ReactNode
    evaluators: ReactNode
    actions: ReactNode
    reviews: ReactNode
    children: ReactNode
}) {
    const session = await getServerSession(authOptions)
    if (!session) return
    if (params.id === 'new') {
        if (!canExecute('CREATE', session.user.role, 'NOT_CREATED'))
            redirect('/protocols')
        return (
            <>
                <PageHeading title={'Nuevo protocolo'} />
                <div className="mx-auto w-full max-w-7xl">{children}</div>
            </>
        )
    }
    const protocol = await getProtocolMetadata(params.id)
    if (!protocol) redirect('/protocols')

    return (
        <>
            <PageHeading title={protocol.sections.identification.title} />
            <div className="flex w-full justify-between gap-3">
                <div>
                    {metadata}
                    {evaluators}
                </div>
                {actions}
            </div>

            <div className="relative z-0 flex flex-col-reverse gap-10 py-6 lg:flex-row lg:gap-2 lg:divide-x">
                <div className="w-full">{children}</div>
                {reviews}
            </div>
        </>
    )
}

export default Layout
