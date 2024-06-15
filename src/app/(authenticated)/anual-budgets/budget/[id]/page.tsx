import { PageHeading } from '@layout/page-heading'
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

export default async function Page({ params }: { params: { id: string } }) {
  const anualBudget = await getAnualBudgetById(params.id)
  if (!anualBudget) redirect('/anual-budgets')

  const { budgetItems, budgetTeamMembers, protocol, ...rest } = anualBudget

  const meta = {
    ...rest,
    title: protocol.sections.identification.title,
    sponsor: protocol.sections.identification.sponsor,
  }
  const calculations = calculateTotalBudget(anualBudget)

  return (
    <div className="w-full">
      <div className="mx-auto max-w-7xl pt-2">
        <PageHeading title={`Presupuesto ${meta.year}`} />
        <div className="flex w-full flex-col items-start justify-between gap-3 sm:flex-row">
          <BudgetMetadata {...meta} />
          <div className="flex gap-2">
            {meta.state === AnualBudgetState.PENDING && (
              <ApproveAnualBudget id={meta.id} />
            )}
            {meta.state === AnualBudgetState.PENDING && (
              <RejectAnualBudget id={meta.id} />
            )}
            {/* If remainings are 0 then budget is finished */}
            {meta.state === AnualBudgetState.APPROVED &&
            (calculations.ABIr !== 0 || calculations.ABTr !== 0) ? (
              <InterruptAnualBudget id={meta.id} protocolId={meta.protocolId} />
            ) : null}
          </div>
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
      </div>
    </div>
  )
}
