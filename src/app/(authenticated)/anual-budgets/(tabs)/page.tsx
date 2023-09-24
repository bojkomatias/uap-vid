import { getAnualBudgetsByAcademicUnit } from '@repositories/anual-budget'
import AnualBudgetTable from 'modules/anual-budget/budget-table'

export default async function AllAnualBudgetPage({
    searchParams,
}: {
    searchParams: { [key: string]: string }
}) {
    const [totalRecords, anualBudgets] = await getAnualBudgetsByAcademicUnit(

        searchParams
    )

    return (
        <AnualBudgetTable
            anualBudgets={anualBudgets}
            totalRecords={totalRecords}
        />
    )
}
