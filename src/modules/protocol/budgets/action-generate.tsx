'use client'

import { generateAnualBudget } from '@actions/anual-budget/action'
import { Button } from '@components/button'
import { notifications } from '@elements/notifications'
import { Prisma } from '@prisma/client'
import { SubmitButton } from '@shared/submit-button'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

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
  const [isSubmitting, setSubmitting] = useState(false)
  const currentYear = new Date().getFullYear()
  const comingYear = new Date().getFullYear() + 1

  const submitGeneration = useCallback(
    async ({
      protocolId,
      year,
      id,
    }: {
      protocolId: string
      year: number
      id?: string
    }) => {
      const budget = await generateAnualBudget({ protocolId, year, id })

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
    []
  )

  // If budget is not "APPROVED" we can upsert as many times as we like.
  const budgetedCurrentYear = anualBudgets.find(
    (budget) => budget.year === currentYear
  )

  const budgetedComingYear = anualBudgets.find(
    (budget) => budget.year === currentYear
  )

  return (
    <>
      <SubmitButton
        color="light"
        disabled={budgetedCurrentYear?.state === 'APPROVED'}
        onClick={() =>
          submitGeneration({
            protocolId,
            year: comingYear,
            id: budgetedCurrentYear?.id,
          })
        }
      >
        Presupuesto año corriente {currentYear}
      </SubmitButton>
      <Button
        disabled={budgetedComingYear?.state === 'APPROVED'}
        onClick={() =>
          submitGeneration({
            protocolId,
            year: comingYear,
            id: budgetedComingYear?.id,
          })
        }
      >
        Presupuesto año entrante {currentYear + 1}
      </Button>
    </>
  )
}
