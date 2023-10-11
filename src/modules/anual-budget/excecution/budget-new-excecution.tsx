'use client'
import {
    saveNewItemExcecution,
    saveNewTeamMemberExcecution,
} from '@actions/anual-budget/action'
import { Button } from '@elements/button'
import CurrencyInput from '@elements/currency-input'
import { ExcecutionType } from '@utils/anual-budget'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState, useTransition } from 'react'

const BudgetNewExcecution = ({
    maxAmount,
    budgetItemPositionIndex,
    anualBudgetTeamMemmberId,
    excecutionType,
}: {
    maxAmount: number
    budgetItemPositionIndex: number
    anualBudgetTeamMemmberId?: string
    excecutionType: ExcecutionType
}) => {
    const [newAmount, setNewAmount] = useState(0)
    const [isPennding, startTransition] = useTransition()
    const router = useRouter()
    const path = usePathname()
    const anualBudgetId = path.split('/')[3]

    const newExcecution = async (amount: number) => {
        if (
            anualBudgetTeamMemmberId &&
            excecutionType === ExcecutionType.TeamMember
        ) {
            await saveNewTeamMemberExcecution(amount, anualBudgetTeamMemmberId)
        }

        if (excecutionType === ExcecutionType.Item) {
            await saveNewItemExcecution(
                budgetItemPositionIndex,
                anualBudgetId,
                amount
            )
        }
        startTransition(() => router.refresh())
    }

    return (
        <div className="flex items-baseline gap-2">
            <CurrencyInput
                maxAmount={maxAmount}
                defaultPrice={0}
                className="min-w-[7rem] rounded-md py-1 text-xs"
                priceSetter={setNewAmount}
            />

            <Button
                className="py-1.5 text-xs shadow-sm"
                intent="secondary"
                // Disabled if it hasn't changed
                disabled={newAmount === 0 || newAmount >= maxAmount}
                loading={isPennding}
                onClick={(e) => {
                    e.preventDefault()
                    newExcecution(newAmount)
                }}
            >
                {isPennding ? 'Creando' : 'Crear'}
            </Button>
            {maxAmount}
        </div>
    )
}

export default BudgetNewExcecution
