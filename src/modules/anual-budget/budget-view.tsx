import type {
  AcademicUnit,
  AmountIndex,
  ProtocolSectionsIdentificationTeam,
} from '@prisma/client'
import { AnualBudgetState } from '@prisma/client'
import type {
  AnualBudgetTeamMemberWithAllRelations,
  AnualBudgetItemWithExecutions,
  TotalBudgetCalculation,
} from '@utils/anual-budget'
import { BudgetTeamMemberFees } from './budget-team-member-fees'
import { BudgetItems } from './budget-items'
import { Badge } from '@components/badge'
import type { WEEKS_IN_YEAR, WEEKS_IN_HALF_YEAR } from '../../utils/constants'
import { Currency } from '@shared/currency'
import { Text } from '@components/text'
import { Subheading } from '@components/heading'
import { ContainerAnimations } from '@elements/container-animations'
import { getCurrentIndexes } from '@repositories/finance-index'

export async function BudgetView({
  budgetId,
  state,
  duration,
  budgetItems,
  budgetTeamMembers,
  calculations,
  academicUnits,
  protocolTeam,
}: {
  budgetId: string
  state: AnualBudgetState
  duration: typeof WEEKS_IN_YEAR | typeof WEEKS_IN_HALF_YEAR
  budgetItems: AnualBudgetItemWithExecutions[]
  budgetTeamMembers: AnualBudgetTeamMemberWithAllRelations[]
  calculations: TotalBudgetCalculation
  academicUnits: AcademicUnit[]
  protocolTeam: ProtocolSectionsIdentificationTeam[]
}) {
  const currentIndexes = await getCurrentIndexes()

  return (
    <ContainerAnimations animation={3}>
      <div>
        <BudgetTeamMemberFees
          editable={state === AnualBudgetState.PENDING}
          budgetTeamMembers={budgetTeamMembers}
          ABTe={calculations.ABTe}
          ABTr={calculations.ABTr}
          duration={duration}
          protocolTeam={protocolTeam}
        />

        <BudgetItems
          academicUnits={academicUnits}
          budgetId={budgetId}
          editable={state === AnualBudgetState.PENDING}
          budgetItems={budgetItems}
          ABIe={calculations.ABIe}
          ABIr={calculations.ABIr}
          currentIndexes={currentIndexes}
        />

        <div className="my-10 mb-20 flex justify-end pt-4">
          <Badge color="teal">
            <Subheading className="!text-xl !font-normal">
              Total del presupuesto:
            </Subheading>
            <Text className="!text-xl">
              <Currency amountIndex={calculations.total} />
            </Text>
          </Badge>
        </div>
      </div>
    </ContainerAnimations>
  )
}
