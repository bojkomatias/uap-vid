import { getBudgetSummary } from '@actions/anual-budget/action'
import { getAnualBudgetsByAcademicUnit } from '@repositories/anual-budget'
import { BudgetSummary } from 'modules/anual-budget/budget-summary'
import AnualBudgetTable from 'modules/anual-budget/budget-table'

export default async function AllAnualBudgetPage({
    searchParams,
}: {
    searchParams: { [key: string]: string }
}) {
    const [totalRecords, anualBudgets] = await getAnualBudgetsByAcademicUnit(
        searchParams
    )

    const budgetSummary = await getBudgetSummary()

    return (
        <>
            <BudgetSummary {...budgetSummary} />
            <AnualBudgetTable
                anualBudgets={anualBudgets}
                totalRecords={totalRecords}
            />
        </>
    )
}
