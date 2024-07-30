import type { AcademicUnit, AnualBudgetItem } from '@prisma/client'
import { AnualBudgetState } from '@prisma/client'
import type {
  AnualBudgetTeamMemberWithAllRelations,
  TotalBudgetCalculation,
} from '@utils/anual-budget'
import { BudgetTeamMemberFees } from './budget-team-member-fees'
import { BudgetItems } from './budget-items'
import { Badge } from '@components/badge'
import type { WEEKS_IN_YEAR, WEEKS_IN_HALF_YEAR } from '../../utils/constants'
import { Currency } from '@shared/currency'

export function BudgetView({
  budgetId,
  state,
  duration,
  budgetItems,
  budgetTeamMembers,
  calculations,
  academicUnits,
}: {
  budgetId: string
  state: AnualBudgetState
  duration: typeof WEEKS_IN_YEAR | typeof WEEKS_IN_HALF_YEAR
  budgetItems: AnualBudgetItem[]
  budgetTeamMembers: AnualBudgetTeamMemberWithAllRelations[]
  calculations: TotalBudgetCalculation
  academicUnits: AcademicUnit[]
}) {
  return (
    <div className="mt-10 space-y-6 ">
      <BudgetTeamMemberFees
        editable={state === AnualBudgetState.PENDING}
        budgetTeamMembers={budgetTeamMembers}
        ABTe={calculations.ABTe}
        ABTr={calculations.ABTr}
        duration={duration}
      />

      <BudgetItems
        academicUnits={academicUnits}
        budgetId={budgetId}
        editable={state === AnualBudgetState.PENDING}
        budgetItems={budgetItems}
        ABIe={calculations.ABIe}
        ABIr={calculations.ABIr}
      />

      <div className="flex justify-end pt-4">
        <Badge>
          <span className="font-normal">Total del presupuesto:</span>
          <span className="font-semibold">
            <Currency amountIndex={calculations.total} />
          </span>
        </Badge>
      </div>
    </div>
  )
}
