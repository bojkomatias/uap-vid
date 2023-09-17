import { Button } from '@elements/button'
import CurrencyInput, { parseLocaleNumber } from '@elements/currency-input'
import PopoverComponent from '@elements/popover'
import { notifications } from '@mantine/notifications'
import type { HistoricCategoryPrice, TeamMemberCategory } from '@prisma/client'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Check, X } from 'tabler-icons-react'

export function UpdateABI({
    budgetId,
    amount,
}: {
    budgetId: string
    amount: number
}) {
    return (
        <PopoverComponent
            actionButton={
                <Button className="py-1.5 text-xs shadow-sm" intent="secondary">
                    Actualizar
                </Button>
            }
            title="Actualizar precio"
        >
            <div className="flex items-center gap-2">
                <p className="text-xs font-semibold">Precio actualizado:</p>
                <CurrencyInput
                    defaultPrice={amount}
                    className="min-w-[7rem] rounded-md py-1 text-xs"
                    priceSetter={(value: number) => console.log(value)}
                />
            </div>
        </PopoverComponent>
    )
}
