import { PageHeading } from '@layout/page-heading'
import { getAnualBudgetById } from '@repositories/anual-budget'
import { calculateTotalBudget } from '@utils/anual-budget'
import { BudgetView } from 'modules/anual-budget/budget-view'
import { BudgetMetadata } from 'modules/anual-budget/budget-metadata'
import { redirect } from 'next/navigation'
import { ApproveAnualBudget } from 'modules/anual-budget/approve-budget'

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
        <>
            <PageHeading title={`Presupuesto ${meta.year}`} />
            <div className="flex w-full flex-col items-end justify-between gap-3 sm:flex-row">
                <BudgetMetadata {...meta} />
                {meta.approved ? null : <ApproveAnualBudget id={meta.id} />}
            </div>
            <BudgetView
                budgetId={meta.id}
                approved={meta.approved}
                budgetItems={budgetItems}
                budgetTeamMembers={budgetTeamMembers}
                calculations={calculations}
            />
        </>
    )
}
