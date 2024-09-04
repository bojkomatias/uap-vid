import { getAnualBudgetById } from '@repositories/anual-budget'
import { calculateTotalBudget } from '@utils/anual-budget'
import { BudgetView } from 'modules/anual-budget/budget-view'
import { BudgetMetadata } from 'modules/anual-budget/budget-metadata'
import { redirect } from 'next/navigation'
import { ApproveAnualBudget } from 'modules/anual-budget/approve-budget'
import { InterruptAnualBudget } from 'modules/anual-budget/interrupt-budget'
import { RejectAnualBudget } from 'modules/anual-budget/reject-budget'
import { protocolDuration } from '@utils/anual-budget/protocol-duration'
import { AnualBudgetState } from '@prisma/client'

export default async function Budget({ params }: { params: { id: string } }) {
  const anualBudget = await getAnualBudgetById(params.id)
  if (!anualBudget) redirect('/')

  const { budgetItems, budgetTeamMembers, protocol, ...rest } = anualBudget

  const meta = {
    ...rest,
    title: protocol.sections.identification.title,
    sponsor: protocol.sections.identification.sponsor,
  }
  const calculations = calculateTotalBudget(anualBudget)

  return (
    <>
      <div className="relative w-full">
        <BudgetMetadata {...meta}>
          <div className="flex gap-2">
            {meta.state === AnualBudgetState.PENDING && (
              <ApproveAnualBudget id={meta.id} />
            )}
            {/* If remainings are 0 then budget is finished */}
            {(
              meta.state === AnualBudgetState.APPROVED &&
              (calculations.ABIr.FCA !== 0 || calculations.ABTr.FCA !== 0)
            ) ?
              <InterruptAnualBudget id={meta.id} protocolId={meta.protocolId} />
            : null}
          </div>
        </BudgetMetadata>
      </div>
      <BudgetView
        budgetId={meta.id}
        state={meta.state}
        duration={protocolDuration(protocol.sections.duration.duration)}
        budgetItems={budgetItems}
        budgetTeamMembers={budgetTeamMembers}
        academicUnits={anualBudget.AcademicUnits}
        calculations={calculations}
      />
    </>
  )
}
