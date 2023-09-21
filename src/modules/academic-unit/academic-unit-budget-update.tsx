'use client'
import { Button } from '@elements/button'
import CurrencyInput from '@elements/currency-input'
import { notifications } from '@mantine/notifications'
import type { AcademicUnitBudget } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Check, X } from 'tabler-icons-react'

export const AcademicUnitBudgetUpdate = ({
    academicUnitId,
    ACBudgets,
}: {
    academicUnitId: string
    ACBudgets: AcademicUnitBudget[]
}) => {
    const router = useRouter()
    const [newAmount, setNewAmount] = useState(ACBudgets.at(-1)!.amount)
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

        const res = await fetch(`/api/academic-units/${id}`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            // Pass the updated budget
            body: JSON.stringify({ budgets: updatedBudgets }),
        })

        if (res.status === 200) {
            notifications.show({
                title: 'Presupuesto actualizado',
                message: 'El presupuesto fue actualizado correctamente',
                color: 'success',
                icon: <Check />,
                radius: 0,
                style: {
                    marginBottom: '.8rem',
                },
            })

            router.refresh()
        } else if (res.status === 422) {
            notifications.show({
                title: 'Error',
                message: 'No se pudo actualizar el precio',
                color: 'red',
                icon: <X />,
                radius: 0,
                style: {
                    marginBottom: '.8rem',
                },
            })
        }
    }
    return (
        <div className="flex items-center gap-2">
            <CurrencyInput
                defaultPrice={ACBudgets.at(-1)?.amount ?? 0}
                className="min-w-[7rem] rounded-md py-1 text-xs"
                priceSetter={(price: number) => setNewAmount(price)}
            />

            <Button
                className="py-1.5 text-xs shadow-sm"
                intent="secondary"
                // Disabled if it hasn't changed
                disabled={ACBudgets.at(-1)!.amount === newAmount}
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
