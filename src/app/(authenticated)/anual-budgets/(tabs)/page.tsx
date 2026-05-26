import { getBudgetSummary } from '@actions/anual-budget/action'
import { getAnualBudgetsByAcademicUnit } from '@repositories/anual-budget'
import { BudgetSummary } from 'modules/anual-budget/budget-summary/budget-summary-template'
import AnualBudgetTable from 'modules/anual-budget/budget-table'

export default async function AllAnualBudgetPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>
}) {
  const resolvedSearchParams = await searchParams
  // Get current year if no year is provided in searchParams
  const currentYear = new Date().getFullYear()
  const year = resolvedSearchParams.year ? parseInt(resolvedSearchParams.year) : currentYear

  // Create updated searchParams with explicit year
  const searchParamsWithYear = {
    ...resolvedSearchParams,
    year: year.toString(),
  }

  const [totalRecords, anualBudgets] =
    await getAnualBudgetsByAcademicUnit(searchParamsWithYear)

  const budgetSummary = await getBudgetSummary(undefined, year)
  return (
    <>
      <BudgetSummary summary={budgetSummary} allAcademicUnits />
      <AnualBudgetTable
        anualBudgets={anualBudgets}
        totalRecords={totalRecords}
      />
    </>
  )
}