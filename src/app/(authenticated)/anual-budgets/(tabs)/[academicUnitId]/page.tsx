import { getBudgetSummary } from '@actions/anual-budget/action'
import { getAnualBudgetsByAcademicUnit } from '@repositories/anual-budget'
import { BudgetSummary } from 'modules/anual-budget/budget-summary/budget-summary-template'
import AnualBudgetTable from 'modules/anual-budget/budget-table'

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ academicUnitId: string }>
  searchParams: Promise<{ [key: string]: string }>
}) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const currentYear = new Date().getFullYear()
  const year = resolvedSearchParams.year ? parseInt(resolvedSearchParams.year) : currentYear

  const [totalRecords, anualBudgets] = await getAnualBudgetsByAcademicUnit(
    resolvedSearchParams,
    resolvedParams.academicUnitId
  )

  const budgetSummary = await getBudgetSummary(resolvedParams.academicUnitId, year)
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
