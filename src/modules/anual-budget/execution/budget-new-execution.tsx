'use client'

import {
  saveNewItemExecution,
  saveNewTeamMemberExecution,
} from '@actions/anual-budget/action'
import { notifications } from '@elements/notifications'
import { useForm, zodResolver } from '@mantine/form'
import type { AcademicUnit } from '@prisma/client'
import { ExecutionType } from '@utils/anual-budget'
import { currencyFormatter } from '@utils/formatters'
import { usePathname, useRouter } from 'next/navigation'
import React, { useTransition } from 'react'
import { z } from 'zod'
import { FormInput } from '@shared/form/form-input'
import { parseLocaleNumber } from '@elements/currency-input'
import { Button } from '@components/button'

const BudgetNewExecution = ({
  academicUnit,
  maxAmount,
  budgetItemPositionIndex,
  anualBudgetTeamMemberId,
  executionType,
}: {
  academicUnit?: AcademicUnit
  maxAmount: number
  budgetItemPositionIndex: number
  anualBudgetTeamMemberId?: string
  executionType: ExecutionType
}) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const path = usePathname()
  const anualBudgetId = path?.split('/')[3]

  const form = useForm({
    initialValues: {
      amount: 1000,
    },
    validate: zodResolver(
      z.object({
        amount: z.coerce
          .number()
          .min(1, { message: 'El valor debe ser mayor a 0' })
          .max(maxAmount, {
            message: `No puede exceder ${
              !maxAmount ? 0 : currencyFormatter.format(maxAmount)
            }`,
          }),
      })
    ),
    validateInputOnChange: true,
  })
  const newExecution = async ({ amount }: { amount: number }) => {
    try {
      if (
        anualBudgetTeamMemberId &&
        executionType === ExecutionType.TeamMember
      ) {
        await saveNewTeamMemberExecution(amount, anualBudgetTeamMemberId)
      }

      if (executionType === ExecutionType.Item) {
        if (!academicUnit) return
        await saveNewItemExecution(
          academicUnit.id,
          budgetItemPositionIndex,
          anualBudgetId!,
          amount
        )
      }
      notifications.show({
        title: 'Ejecución creada',
        message: 'La ejecución ha sido creada con éxito',
        intent: 'success',
      })
      startTransition(() => router.refresh())
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Ha ocurrido un error al crear la ejecución',
        intent: 'error',
      })
    }
  }
  const updateOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    form.setFieldValue('amount', parseLocaleNumber(e.target.value, 'es-AR'))
  }
  return (
    <form
      onClick={form.onSubmit((values) => newExecution(values))}
      className="flex items-baseline justify-between gap-2"
    >
      <FormInput
        className="flex flex-grow flex-row items-center gap-2"
        type="number"
        label="Monto"
        {...form.getInputProps('amount')}
        onBlur={updateOnBlur}
      />

      <Button
        type="submit"
        outline
        // Disabled if it hasn't changed
        disabled={!form.isValid('amount') || !form.isDirty('amount')}
      >
        {isPending ? 'Cargando' : 'Cargar'}
      </Button>
    </form>
  )
}

export default BudgetNewExecution
