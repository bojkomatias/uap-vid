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
import { findProtocolById } from '@repositories/protocol'
import { Check, X } from 'tabler-icons-react'
import { Button } from '@components/button'
import Info from 'modules/info'
import { getAcademicUnitById } from '@repositories/academic-unit'

export default async function Budget({ params }: { params: { id: string } }) {
  const anualBudget = await getAnualBudgetById(params.id)
  if (!anualBudget) redirect('/')

  const { budgetItems, budgetTeamMembers, protocol, ...rest } = anualBudget

  const meta = {
    ...rest,
    title: protocol.sections.identification.title,
  }
  const calculations = calculateTotalBudget(anualBudget)

  const protocolFlags = await findProtocolById(protocol.id).then((p) => {
    return p?.flags
  })

  const academicUnits = await Promise.all(
    meta.academicUnitsIds.map((id) => getAcademicUnitById(id))
  )

  const shortnames = academicUnits.flat().map((ac) => {
    return ac?.shortname!
  })

  return (
    <>
      <div className="relative w-full">
        <BudgetMetadata {...meta} sponsor={shortnames}>
          <div className="flex min-w-[15rem] justify-end gap-2">
            {(
              meta.state === AnualBudgetState.PENDING &&
              !protocolFlags?.some((flag) => flag.state == false) &&
              protocolFlags?.length == 2
            ) ?
              <ApproveAnualBudget id={anualBudget.id} />
            : <Info content="Los votos de Comisión Interna y CUCYT no fueron cargados.">
                <Button className="pointer-events-none" color="teal" disabled>
                  <Check data-slot="icon" />
                  Aprobar presupuesto
                </Button>
              </Info>
            }
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
