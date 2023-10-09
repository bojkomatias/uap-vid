import type { AnualBudgetItem } from '@prisma/client'
import type {
    AnualBudgetTeamMemberWithAllRelations,
    TotalBudgetCalculation,
} from '@utils/anual-budget'
import { currencyFormatter } from '@utils/formatters'
import { BudgetTeamMemberFees } from './budget-team-member-fees'
import { BudgetItems } from './budget-items'

export function BudgetView({
    budgetId,
    approved,
    budgetItems,
    budgetTeamMembers,
    calculations,
}: {
    budgetId: string
    approved: boolean
    budgetItems: AnualBudgetItem[]
    budgetTeamMembers: AnualBudgetTeamMemberWithAllRelations[]
    calculations: TotalBudgetCalculation
}) {
    return (
        <div className="mx-auto mt-10 max-w-7xl space-y-6">
            <BudgetTeamMemberFees
                approved={true}
                budgetTeamMembers={budgetTeamMembers}
                ABTe={calculations.ABTe}
                ABTr={calculations.ABTr}
            />

            <BudgetItems
                budgetId={budgetId}
                approved={true}
                budgetItems={budgetItems}
                ABIe={calculations.ABIe}
                ABIr={calculations.ABIr}
            />

            <div className="flex justify-between text-lg font-medium">
                <span>Total de presupuesto (ARS):</span>
                <span className="font-semibold">
                    ${currencyFormatter.format(calculations.total)}
                </span>
            </div>
        </div>
    )
}
