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
import React, { useState, useTransition } from 'react'
import { z } from 'zod'
import { FormInput } from '@shared/form/form-input'
import { parseLocaleNumber } from '@elements/currency-input'
import { Button } from '@components/button'
import { SubmitButton } from '@shared/submit-button'
import { FieldGroup } from '@components/fieldset'
import { FormCombobox } from '@shared/form/form-combobox'

const BudgetNewExecution = ({
  academicUnits,
  maxAmount,
  budgetItemPositionIndex,
  anualBudgetTeamMemberId,
  executionType,
}: {
  academicUnits?: AcademicUnit[]
  maxAmount: number
  budgetItemPositionIndex: number
  anualBudgetTeamMemberId?: string
  executionType: ExecutionType
}) => {
  const [isPending, startTransition] = useTransition()
  const [isSubmitting, setSubmitting] = useState(false)
  const router = useRouter()
  const path = usePathname()
  const anualBudgetId = path?.split('/')[3]

  const form = useForm({
    initialValues: {
      amount: 1000,
      academicUnit: undefined,
    },
    validate: zodResolver(
      z.object({
        amount: z.coerce
          .number()
          .min(1, { message: 'El valor debe ser mayor a 0' }),
        // Temporarily disabled max validation
        // .max(maxAmount, {
        //   message: `No puede exceder ${
        //     !maxAmount ? 0 : currencyFormatter.format(maxAmount)
        //   }`,
        // }),
      })
    ),
  })

  const newExecution = async ({
    amount,
    academicUnit,
  }: {
    amount: number
    academicUnit?: string
  }) => {
    setSubmitting(true)
    try {
      if (
        anualBudgetTeamMemberId &&
        executionType === ExecutionType.TeamMember
      ) {
        await saveNewTeamMemberExecution(amount, anualBudgetTeamMemberId)
      }

      if (executionType === ExecutionType.Item) {
        if (!academicUnit)
          return notifications.show({
            title: 'Falta unidad académica',
            message:
              'Debe seleccionar una unidada académica a la cual se le computa el gasto',
            intent: 'error',
          })
        await saveNewItemExecution(
          academicUnit,
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
      startTransition(() => {
        setSubmitting(false)
        router.refresh()
      })
    } catch (error) {
      setSubmitting(false)
      notifications.show({
        title: 'Error',
        message: 'Ha ocurrido un error al crear la ejecución',
        intent: 'error',
      })
    }
  }

  return (
    <form onSubmit={form.onSubmit((values) => newExecution(values))}>
      <FieldGroup className="flex items-end justify-between">
        {academicUnits ?
          <FormCombobox
            label="Unidad academica"
            options={academicUnits.map((e) => ({ label: e.name, value: e.id }))}
            {...form.getInputProps('academicUnit')}
          />
        : null}
        <FormInput
          type="number"
          label="Monto"
          {...form.getInputProps('amount')}
        />

        <SubmitButton isLoading={isSubmitting || isPending}>
          Cargar
        </SubmitButton>
      </FieldGroup>
    </form>
  )
}

export default BudgetNewExecution
