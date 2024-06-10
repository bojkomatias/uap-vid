'use client'
import { Button } from '@elements/button'
import CurrencyInput from '@elements/currency-input'
import { notifications } from '@elements/notifications'
import type { AcademicUnitBudget } from '@prisma/client'
import { updateAcademicUnit } from '@repositories/academic-unit'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const AcademicUnitBudgetUpdate = ({
    academicUnitId,
    ACBudgets,
}: {
    academicUnitId: string
    ACBudgets: AcademicUnitBudget[]
}) => {
    const router = useRouter()
    const [newAmount, setNewAmount] = useState(ACBudgets.at(-1)?.amount ?? 0)

    const updateBudget = async (id: string, budgets: AcademicUnitBudget[]) => {
        // Create a new budget object
        const newBudget = {
            from: new Date(),
            amount: newAmount,
        }

        // Update the old price to set the 'to' property
        const oldBudget = budgets[budgets.length - 1]
            ? {
                  ...budgets[budgets.length - 1],
                  to: new Date(),
              }
            : {
                  amount: 0,
                  from: new Date(0),
                  to: new Date(),
              }

        // Create a new array of prices with the updated old price and new price
        const updatedBudgets = [
            ...budgets.slice(0, budgets.length - 1),
            oldBudget,
            newBudget,
        ]

        const res = await updateAcademicUnit(id, { budgets: updatedBudgets })

        if (res) {
            notifications.show({
                title: 'Presupuesto actualizado',
                message: 'El presupuesto fue actualizado correctamente',
                intent: 'success',
            })

            return router.refresh()
        }
        notifications.show({
            title: 'Error',
            message: 'No se pudo actualizar el precio',
            intent: 'error',
        })
    }

    return (
        <div className="flex items-center gap-2">
            <CurrencyInput
                defaultPrice={ACBudgets.at(-1)?.amount ?? 0}
                className="min-w-[7rem] rounded-md py-1 text-xs"
                priceSetter={(e) => setNewAmount(e)}
            />

            <Button
                className="py-1.5 text-xs shadow-sm"
                intent="secondary"
                // Disabled if it hasn't changed
                disabled={ACBudgets.at(-1)?.amount === newAmount}
                onClick={(e) => {
                    e.preventDefault()
                    updateBudget(academicUnitId, ACBudgets)
                }}
            >
                Actualizar
            </Button>
        </div>
    )
}
