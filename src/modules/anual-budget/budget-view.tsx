import type {
    AcademicUnit,
    AnualBudgetItem,
    AnualBudgetState,
} from '@prisma/client'
import type {
    AnualBudgetTeamMemberWithAllRelations,
    TotalBudgetCalculation,
} from '@utils/anual-budget'
import { currencyFormatter } from '@utils/formatters'
import { BudgetTeamMemberFees } from './budget-team-member-fees'
import { BudgetItems } from './budget-items'
import { Badge } from '@elements/badge'

export function BudgetView({
    budgetId,
    state,
    budgetItems,
    budgetTeamMembers,
    calculations,
    academicUnits,
}: {
    budgetId: string
    state: AnualBudgetState
    budgetItems: AnualBudgetItem[]
    budgetTeamMembers: AnualBudgetTeamMemberWithAllRelations[]
    calculations: TotalBudgetCalculation
    academicUnits: AcademicUnit[]
}) {
    return (
        <div className="mt-10 space-y-6 ">
            <BudgetTeamMemberFees
                editable={state === 'PENDING'}
                budgetTeamMembers={budgetTeamMembers}
                ABTe={calculations.ABTe}
                ABTr={calculations.ABTr}
            />

            <BudgetItems
                academicUnits={academicUnits}
                budgetId={budgetId}
                editable={state === 'PENDING'}
                budgetItems={budgetItems}
                ABIe={calculations.ABIe}
                ABIr={calculations.ABIr}
            />

            <div className="flex justify-end pt-4">
                <Badge className="flex gap-2 text-lg">
                    {' '}
                    <span className="font-normal">
                        Total de presupuesto (ARS):
                    </span>
                    <span className="font-semibold">
                        ${currencyFormatter.format(calculations.total)}
                    </span>
                </Badge>
            </div>
        </div>
    )
}
