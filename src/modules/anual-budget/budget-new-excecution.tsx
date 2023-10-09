'use client'
import { Button } from '@elements/button'
import CurrencyInput from '@elements/currency-input'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'

const BudgetNewExcecution = () => {
    const [newAmount, setNewAmount] = useState(0)
    const path = usePathname()
    const budgetId = path.split('/')[3]

    const newExcecution = async (amount: number) => {
        alert(
            `Se creará una nueva ejecución de $${amount} bajo el presupuesto ${budgetId}`
        )
    }

    return (
        <div className="flex items-center gap-2">
            <CurrencyInput
                defaultPrice={0}
                className="min-w-[7rem] rounded-md py-1 text-xs"
                priceSetter={setNewAmount}
            />

            <Button
                className="py-1.5 text-xs shadow-sm"
                intent="secondary"
                // Disabled if it hasn't changed
                disabled={newAmount === 0}
                onClick={(e) => {
                    e.preventDefault()
                    newExcecution(newAmount)
                }}
            >
                Crear
            </Button>
        </div>
    )
}

export default BudgetNewExcecution
