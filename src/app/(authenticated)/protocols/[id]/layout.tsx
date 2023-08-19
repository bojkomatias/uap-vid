import { PageHeading } from '@layout/page-heading'
import { canExecute } from '@utils/scopes'
import { getServerSession } from 'next-auth'
import type { ReactNode } from 'react'
import { findProtocolById } from 'repositories/protocol'
import { redirect } from 'next/navigation'
import Reviews from '@review/reviews-template'
import { authOptions } from 'app/api/auth/[...nextauth]/route'
import { ProtocolMetadata } from '@protocol/protocol-metadata'

async function Layout({
    params,
    children,
}: {
    params: { id: string }
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
    const protocol = await findProtocolById(params.id)
    if (!protocol) redirect('/protocols')

    return (
        <>
            <PageHeading
                title={
                    <span>
                        Protocolo:{' '}
                        <span className="font-normal">
                            {protocol.sections.identification.title}
                        </span>
                    </span>
                }
            />
            <ProtocolMetadata
                id={protocol.id}
                createdAt={protocol.createdAt}
                state={protocol.state}
                researcher={protocol.researcher}
                convocatory={protocol.convocatory}
            />

            <div className="flex flex-col-reverse lg:flex-row">
                <div className="mx-auto w-full max-w-7xl">{children}</div>

                <Reviews
                    id={protocol.id}
                    researcherId={protocol.researcherId}
                    state={protocol.state}
                    userId={session.user.id}
                    userRole={session.user.role}
                />
            </div>
        </>
    )
}

export default Layout
