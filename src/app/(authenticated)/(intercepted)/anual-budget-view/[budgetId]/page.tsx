import { getAnualBudgetById } from '@repositories/anual-budget'
import { canExecute } from '@utils/scopes'
import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import { BudgetResearcherView } from 'modules/anual-budget/budget-researcher-view'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function Page({
  params,
}: {
  params: { budgetId: string }
}) {
  const session = await getServerSession(authOptions)
  const anualBudget = await getAnualBudgetById(params.budgetId)
  if (!session || !anualBudget) redirect('/protocols')
  if (
    canExecute(
      'VIEW_ANUAL_BUDGET',
      session.user.role,
      anualBudget.protocol.state
    )
  )
    return (
      <div className="pt-20">
        <h1 className="pl-2 text-lg font-medium leading-7">
          Presupuesto de: {anualBudget.protocol.sections.identification.title}
        </h1>
        <BudgetResearcherView budgetId={params.budgetId} />
      </div>
    )
  return redirect('/protocols')
}
