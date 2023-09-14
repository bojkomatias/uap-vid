import { PageHeading } from '@layout/page-heading'
import { getAnualBudgetById } from '@repositories/anual-budget'
import { calculateTotalBudget } from '@utils/anual-budget'
import AnualBudgetForm from 'modules/anual-budget/anual-budget-view'
import { redirect } from 'next/navigation'

export default async function Page({ params }: { params: { id: string } }) {
    const anualBudget = await getAnualBudgetById(params.id)
    if (!anualBudget) redirect('/anual-budgets')

    const { budgetItems, budgetTeamMembers, ...meta } = anualBudget

    const calculations = await calculateTotalBudget(anualBudget)

    return (
        <>
            <PageHeading title={'Presupuesto anual'} />
            <AnualBudgetForm
                meta={meta}
                budgetItems={budgetItems}
                budgetTeamMembers={budgetTeamMembers}
                calculations={calculations}
            />
        </>
    )
}
