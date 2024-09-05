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

  const currentYear = new Date().getFullYear()
  const comingYear = new Date().getFullYear() + 1

  const [isSubmitting, setSubmitting] = useState({
    year: currentYear,
    state: false,
  })

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
      setSubmitting({ year, state: true })
      const budget = await generateAnualBudget({
        protocolId,
        year,
        budgetId: id,
      })

      if (budget) {
        notifications.show({
          title: 'Presupuesto generado',
          message: 'Se generó correctamente el presupuesto',
          intent: 'success',
        })
        setTimeout(() => {
          setSubmitting({ year, state: false })
          router.push(`/anual-budgets/budget/${budget}`)
        }, 2500)
      } else {
        setSubmitting({ year, state: false })
        notifications.show({
          title: 'Problema al generar presupuesto',
          message: 'Ocurrió un error al generar el presupuesto',
          intent: 'error',
        })
      }
    },
    []
  )

  // If budget is not "APPROVED" we can upsert as many times as we like.
  const budgetedCurrentYear = anualBudgets.find(
    (budget) => budget.year === currentYear
  )

  const budgetedComingYear = anualBudgets.find(
    (budget) => budget.year === comingYear
  )

  return (
    <>
      {budgetedCurrentYear && budgetedCurrentYear?.state !== 'PENDING' ? null
      : <SubmitButton
          color="light"
          isLoading={isSubmitting.year == currentYear && isSubmitting.state}
          onClick={() =>
            submitGeneration({
              protocolId,
              year: currentYear,
              id: budgetedCurrentYear?.id,
            })
          }
        >
          Presupuesto año corriente {currentYear}
        </SubmitButton>}
      {budgetedComingYear && budgetedComingYear?.state !== 'PENDING' ? null : (
        <SubmitButton
          isLoading={isSubmitting.year == comingYear && isSubmitting.state}
          onClick={() =>
            submitGeneration({
              protocolId,
              year: comingYear,
              id: budgetedComingYear?.id,
            })
          }
        >
          Presupuesto año entrante {comingYear}
        </SubmitButton>
      )}
    </>
  )
}
