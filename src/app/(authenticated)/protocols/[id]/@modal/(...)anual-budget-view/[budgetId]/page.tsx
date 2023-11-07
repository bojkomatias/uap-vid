import { ProtocolInterceptedModal } from '@protocol/elements/protocol-intercepted-modal'
import { BudgetResearcherView } from 'modules/anual-budget/budget-researcher-view'

export default async function ModalPage({
    params,
}: {
    params: { budgetId: string }
}) {
    return (
        <ProtocolInterceptedModal>
            <BudgetResearcherView budgetId={params.budgetId} />
        </ProtocolInterceptedModal>
    )
}
