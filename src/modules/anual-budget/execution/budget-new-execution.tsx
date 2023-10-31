'use client'
import {
    saveNewItemExecution,
    saveNewTeamMemberExecution,
} from '@actions/anual-budget/action'
import { Button } from '@elements/button'
import CurrencyInput from '@elements/currency-input'
import { useForm, zodResolver } from '@mantine/form'
import type { AcademicUnit } from '@prisma/client'
import { ExecutionType } from '@utils/anual-budget'
import { cx } from '@utils/cx'
import { currencyFormatter } from '@utils/formatters'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState, useTransition } from 'react'
import { z } from 'zod'

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

    const newExecution = async (amount: number) => {
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
        startTransition(() => router.refresh())
    }
    const form = useForm({
        initialValues: {
            amount: 1000,
        },
        validate: zodResolver(
            z.object({
                amount: z
                    .number()
                    .min(0, { message: 'El valor debe ser mayor a 0' })
                    .max(maxAmount, {
                        message: `Monto restante: $${
                            !maxAmount ? 0 : currencyFormatter.format(maxAmount)
                        }`,
                    }),
            })
        ),
        validateInputOnChange: true,
    })
    return (
        <form className="flex items-baseline gap-2">
            <div className="flex flex-col ">
                <CurrencyInput
                    maxAmount={maxAmount}
                    defaultPrice={0}
                    className={cx(
                        'min-w-[7rem] rounded-md py-1 text-xs',
                        !form.isValid('amount') &&
                            'border-error-200 bg-error-50'
                    )}
                    priceSetter={(e) => form.setFieldValue('amount', e)}
                />
                <p className="mt-2 text-xs text-error-500">
                    {form.getInputProps('amount').error}
                </p>
            </div>

            <Button
                className="py-1.5 text-xs shadow-sm"
                intent="secondary"
                // Disabled if it hasn't changed
                disabled={!form.isValid('amount') || !form.isDirty('amount')}
                loading={isPending}
                onClick={(e) => {
                    e.preventDefault()
                    newExecution(form.values.amount)
                }}
            >
                {isPending ? 'Creando' : 'Crear'}
            </Button>
        </form>
    )
}

export default BudgetNewExecution
