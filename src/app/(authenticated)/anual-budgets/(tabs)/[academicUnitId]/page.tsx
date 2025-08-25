import { getBudgetSummary } from '@actions/anual-budget/action'
import { getAnualBudgetsByAcademicUnit } from '@repositories/anual-budget'
import { BudgetSummary } from 'modules/anual-budget/budget-summary/budget-summary-template'
import AnualBudgetTable from 'modules/anual-budget/budget-table'

export default async function Page({
  params,
  searchParams,
}: {
  params: { academicUnitId: string }
  searchParams: { [key: string]: string }
}) {
  const currentYear = new Date().getFullYear()
  const year = searchParams.year ? parseInt(searchParams.year) : currentYear

  const [totalRecords, anualBudgets] = await getAnualBudgetsByAcademicUnit(
    searchParams,
    params.academicUnitId
  )

  const budgetSummary = await getBudgetSummary(params.academicUnitId, year)
  console.log('page.tsx', params.academicUnitId)
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
