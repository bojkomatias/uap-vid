import { getAnualBudgetById } from '@repositories/anual-budget'
import { BudgetProtocolView } from 'modules/anual-budget/budget-protocol-view'

export default async function Page({
  params,
}: {
  params: { budgetId: string }
}) {
  const budget = await getAnualBudgetById(params.budgetId)

  if (!budget) return null

  return <BudgetProtocolView budget={budget} />
}
