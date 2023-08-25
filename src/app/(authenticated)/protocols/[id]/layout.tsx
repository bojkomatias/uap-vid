import { PageHeading } from '@layout/page-heading'
import { canExecute, canExecuteActions } from '@utils/scopes'
import { getServerSession } from 'next-auth'
import type { ReactNode } from 'react'
import {
    findProtocolById,
    findProtocolByIdWithResearcher,
} from 'repositories/protocol'
import { redirect } from 'next/navigation'
import Reviews from '@review/reviews-template'
import { authOptions } from 'app/api/auth/[...nextauth]/route'
import { ProtocolMetadata } from '@protocol/protocol-metadata'
import ApproveButton from '@protocol/elements/action-buttons/approve'
import AcceptButton from '@protocol/elements/action-buttons/accept'
import PublishButton from '@protocol/elements/action-buttons/publish'
import EditButton from '@protocol/elements/action-buttons/edit'
import { getReviewsByProtocol } from '@repositories/review'
import { ACTION } from '@utils/zod'
import ReviewAssignation from '@review/review-assignation'

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
    const protocol = await findProtocolByIdWithResearcher(params.id)
    if (!protocol) redirect('/protocols')
    const reviews = await getReviewsByProtocol(protocol.id)

    return (
        <>
            <PageHeading title={protocol.sections.identification.title} />
            <div className="flex w-full gap-3">
                <ProtocolMetadata
                    currentUser={session.user}
                    id={protocol.id}
                    createdAt={protocol.createdAt}
                    state={protocol.state}
                    researcher={protocol.researcher}
                    convocatory={protocol.convocatory}
                />
                <div className="flew-row-reverse flex flex-grow flex-wrap items-center justify-end gap-2 p-1">
                    <ApproveButton
                        role={session.user.role}
                        protocol={protocol}
                    />
                    <AcceptButton
                        role={session.user.role}
                        protocol={protocol}
                        reviews={reviews}
                    />
                    <PublishButton
                        userId={session.user.id}
                        protocol={protocol}
                    />
                    <EditButton
                        user={session.user}
                        researcherId={protocol.researcherId}
                        state={protocol.state}
                        id={protocol.id}
                        reviews={reviews}
                    />
                </div>
            </div>

            {canExecuteActions(
                session.user.id === protocol.researcherId
                    ? []
                    : [
                          ACTION.ASSIGN_TO_METHODOLOGIST,
                          ACTION.ASSIGN_TO_SCIENTIFIC,
                          ACTION.ACCEPT,
                      ],
                session.user.role,
                protocol.state
            ) ? (
                <div className="relative z-0 my-1 ml-2 max-w-4xl rounded bg-gray-50/50 px-3 py-2 leading-relaxed drop-shadow-sm">
                    <ReviewAssignation
                        protocolId={protocol.id}
                        researcherId={protocol.researcherId}
                        protocolState={protocol.state}
                    />
                </div>
            ) : null}

            <div className="flex flex-col-reverse gap-10 py-6 lg:flex-row lg:gap-2 lg:divide-x">
                <div className="w-full">{children}</div>
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
