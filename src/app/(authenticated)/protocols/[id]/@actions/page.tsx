import AcceptButton from '@protocol/elements/action-buttons/accept'
import { DeleteButton } from '@protocol/elements/action-buttons/delete'
import { DiscontinueButton } from '@protocol/elements/action-buttons/discontinue'
import EditButton from '@protocol/elements/action-buttons/edit'
import { FinishButton } from '@protocol/elements/action-buttons/finish'
import { GenerateAnualBudgetButton } from '@protocol/elements/action-buttons/generate-budget-button'
import PublishButton from '@protocol/elements/action-buttons/publish'
import { BudgetDropdown } from '@protocol/elements/budgets/budget-dropdown'
import { findProtocolByIdWithResearcher } from '@repositories/protocol'
import { getReviewsByProtocol } from '@repositories/review'
import { canExecute } from '@utils/scopes'
import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import { getServerSession } from 'next-auth'

export default async function ActionsPage({
    params,
}: {
    params: { id: string }
}) {
    const session = await getServerSession(authOptions)
    const protocol = await findProtocolByIdWithResearcher(params.id)
    if (!protocol || !session) return
    const reviews = await getReviewsByProtocol(protocol.id)

    return (
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
                protocol={{
                    id: protocol.id,
                    state: protocol.state,
                }}
                reviews={reviews}
            />
            {/* I need to pass the whole protocol to check validity! */}
            <PublishButton user={session.user} protocol={protocol} />
            {canExecute(
                'VIEW_ANUAL_BUDGET',
                session.user.role,
                protocol.state
            ) &&
                protocol.anualBudgets.length > 0 && (
                    <BudgetDropdown budgets={protocol.anualBudgets} />
                )}
            {canExecute(
                'GENERATE_ANUAL_BUDGET',
                session.user.role,
                protocol.state
            ) && <GenerateAnualBudgetButton protocolId={protocol.id} />}
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
    )
}
