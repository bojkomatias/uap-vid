import { getAnualBudgetsByAcademicUnit } from '@repositories/anual-budget'
import AnualBudgetTable from 'modules/anual-budget/budget-table'

export default async function Page({
    params,
    searchParams,
}: {
    params: { name: string }
    searchParams: { [key: string]: string }
}) {
    const [totalRecords, anualBudgets] = await getAnualBudgetsByAcademicUnit(
        searchParams,
        params.name
    )

    return (
        <AnualBudgetTable
            anualBudgets={anualBudgets}
            totalRecords={totalRecords}
        />
    )
}
