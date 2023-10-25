import { PageHeading } from '@layout/page-heading'
import { canAccess, canExecute } from '@utils/scopes'
import { getServerSession } from 'next-auth'
import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import Reviews from '@review/reviews-template'
import { authOptions } from 'app/api/auth/[...nextauth]/route'
import { ProtocolMetadata } from '@protocol/protocol-metadata'
import AcceptButton from '@protocol/elements/action-buttons/accept'
import PublishButton from '@protocol/elements/action-buttons/publish'
import EditButton from '@protocol/elements/action-buttons/edit'
import { getReviewsByProtocol } from '@repositories/review'
import ReviewAssignation from '@review/review-assignation'
import { findProtocolByIdWithResearcher } from '@repositories/protocol'
import { DiscontinueButton } from '@protocol/elements/action-buttons/discontinue'
import { FinishButton } from '@protocol/elements/action-buttons/finish'
import { DeleteButton } from '@protocol/elements/action-buttons/delete'
import GenerateAnualBudgetButton from '@protocol/elements/action-buttons/generate-anual-budget'
import { protocolToAnualBudgetPreview } from '@actions/anual-budget/action'

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
    const budgetPreview = await protocolToAnualBudgetPreview(
        protocol.id,
        protocol.sections.budget,
        protocol.sections.identification.team
    )

    const hasBudgetCurrentYear = protocol.anualBudgets
        .map((b) => {
            return b.year == new Date().getFullYear()
        })
        .some((s) => s == true)

    return (
        <>
            <PageHeading title={protocol.sections.identification.title} />
            <div className="flex w-full justify-between gap-3">
                <ProtocolMetadata
                    currentUser={session.user}
                    id={protocol.id}
                    protocolNumber={protocol.protocolNumber}
                    createdAt={protocol.createdAt}
                    state={protocol.state}
                    researcher={protocol.researcher}
                    convocatory={protocol.convocatory}
                />

                <div className="flex flex-row-reverse flex-wrap items-center justify-end gap-2 p-1">
                    <FinishButton
                        role={session.user.role}
                        protocol={{
                            id: protocol.id,
                            state: protocol.state,
                        }}
                    />
                    <AcceptButton
                        role={session.user.role}
                        protocol={{ id: protocol.id, state: protocol.state }}
                        reviews={reviews}
                    />
                    {/* I need to pass the whole protocol to check validity! */}
                    <PublishButton user={session.user} protocol={protocol} />
                    {canExecute(
                        'GENERATE_ANUAL_BUDGET',
                        session.user.role,
                        protocol.state
                    ) ? (
                        <GenerateAnualBudgetButton
                            hasBudgetCurrentYear={hasBudgetCurrentYear}
                            budgetPreview={budgetPreview}
                            teamMembers={protocol.sections.identification.team}
                        />
                    ) : null}
                    <EditButton
                        user={session.user}
                        protocol={{
                            id: protocol.id,
                            state: protocol.state,
                            researcherId: protocol.researcherId,
                        }}
                        reviews={reviews}
                    />
                    <DiscontinueButton
                        role={session.user.role}
                        protocol={{
                            id: protocol.id,
                            state: protocol.state,
                        }}
                    />
                    <DeleteButton
                        role={session.user.role}
                        protocol={{
                            id: protocol.id,
                            state: protocol.state,
                        }}
                    />
                </div>
            </div>

            {canAccess('EVALUATORS', session.user.role) &&
            protocol.state !== 'DRAFT' ? (
                <div className="relative z-10 my-1 ml-2 max-w-3xl rounded bg-gray-50/50 px-3 py-2 leading-relaxed drop-shadow-sm">
                    <ReviewAssignation
                        role={session.user.role}
                        protocolId={protocol.id}
                        researcherId={protocol.researcherId}
                        protocolState={protocol.state}
                    />
                </div>
            ) : null}

            <div className="relative z-0 flex flex-col-reverse gap-10 py-6 lg:flex-row lg:gap-2 lg:divide-x">
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
