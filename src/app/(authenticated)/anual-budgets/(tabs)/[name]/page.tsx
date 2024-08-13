import { getBudgetSummary } from '@actions/anual-budget/action'
import { getAnualBudgetsByAcademicUnit } from '@repositories/anual-budget'
import { BudgetSummary } from 'modules/anual-budget/budget-summary/budget-summary-template'
import AnualBudgetTable from 'modules/anual-budget/budget-table'

//Force it to be dynamic so it doesn't break the build in the Docker container
export const dynamic = 'force-dynamic'

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
  const budgetSummary = await getBudgetSummary(params.name)
  return (
    <>
      <BudgetSummary summary={budgetSummary} />
      <AnualBudgetTable
        anualBudgets={anualBudgets}
        totalRecords={totalRecords}
      />
    </>
  )
}
