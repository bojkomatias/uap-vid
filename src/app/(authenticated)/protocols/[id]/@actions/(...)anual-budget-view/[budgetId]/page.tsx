import { BudgetModalView } from '@protocol/elements/budgets/budget-modal-view'
import { BudgetResearcherView } from 'modules/anual-budget/budget-researcher-view'

export default async function ModalPage({
    params,
}: {
    params: { budgetId: string }
}) {
    return (
        <BudgetModalView>
            <BudgetResearcherView budgetId={params.budgetId} />
        </BudgetModalView>
    )
}
