import { PageHeading } from '@layout/page-heading'
import { getAnualBudgetById } from '@repositories/anual-budget'
import { calculateTotalBudget } from '@utils/anual-budget'
import { BudgetView } from 'modules/anual-budget/budget-view'
import { BudgetMetadata } from 'modules/anual-budget/budget-metadata'
import { redirect } from 'next/navigation'

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
    meta.approved = false
    return (
        <>
            <PageHeading title={`Presupuesto ${meta.year}`} />
            <BudgetMetadata {...meta} />
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
