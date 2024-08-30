'use client'

import { generateAnualBudget } from '@actions/anual-budget/action'
import { Badge } from '@components/badge'
import { Button } from '@components/button'
import { notifications } from '@elements/notifications'
import { Prisma } from '@prisma/client'
import { getAnualBudgetById } from '@repositories/anual-budget'
import { useRouter } from 'next/navigation'

export function ActionGenerateButton({
  protocolId,
  anualBudgets,
}: {
  protocolId: string
  anualBudgets: Prisma.AnualBudgetGetPayload<{
    select: { createdAt: true; year: true; id: true; state: true }
  }>[]
}) {
  const router = useRouter()
  const currentYear = new Date().getFullYear()
  const options = [
    {
      year: currentYear,
      title: `Presupuestar para ${currentYear}`,
      onClick: async () => {
        const budget = await generateAnualBudget(
          protocolId,
          currentYear.toString()
        )

        if (budget) {
          notifications.show({
            title: 'Presupuesto generado',
            message: 'Se generó correctamente el presupuesto',
            intent: 'success',
          })
          setTimeout(() => {
            router.push(`/anual-budgets/budget/${budget}`)
          }, 2500)
        } else
          notifications.show({
            title: 'Problema al generar presupuesto',
            message: 'Ocurrió un error al generar el presupuesto',
            intent: 'error',
          })
      },
    },
    {
      year: currentYear + 1,
      title: `Presupuestar para ${currentYear + 1}`,
      onClick: async () => {
        const budget = await generateAnualBudget(
          protocolId,
          (currentYear + 1).toString()
        )

        if (budget) {
          notifications.show({
            title: 'Presupuesto generado',
            message: 'Se generó correctamente el presupuesto',
            intent: 'success',
          })
          setTimeout(() => {
            router.push(`/anual-budgets/budget/${budget}`)
          }, 500)
        } else
          notifications.show({
            title: 'Problema al generar presupuesto',
            message: 'Ocurrió un error al generar el presupuesto',
            intent: 'error',
          })
      },
    },
  ]

  // If has draft budgets can re-generate more. This overrides the previous draft.
  const approvedBudgetsYears = anualBudgets
    .filter((budget) => budget.state === 'APPROVED')
    .map((e) => e.year)

  return options.map(({ year, title, onClick }) => (
    <Button
      onClick={onClick}
      disabled={approvedBudgetsYears.includes(year)}
      title={
        approvedBudgetsYears.includes(year) ?
          'El año ya tiene presupuesto aprobado'
        : undefined
      }
    >
      {title}
    </Button>
  ))
}
