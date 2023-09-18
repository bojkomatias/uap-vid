import { Button } from '@elements/button'
import CurrencyInput, { parseLocaleNumber } from '@elements/currency-input'
import PopoverComponent from '@elements/popover'
import { notifications } from '@mantine/notifications'
import type { HistoricCategoryPrice, TeamMemberCategory } from '@prisma/client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Check, X } from 'tabler-icons-react'

export default function PriceUpdate({
    category,
}: {
    category: TeamMemberCategory
}) {
    const router = useRouter()
    // Atomic price[last].price
    const [price, setPrice] = useState(category.price.at(-1)!.price)

    const updatePrice = async (id: string, data: TeamMemberCategory) => {
        const res = await fetch(`/api/categories/${id}`, {
            method: 'PATCH',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        if (res.status === 200) {
            notifications.show({
                title: 'Precio actualizado',
                message: 'El precio fue actualizado correctamente',
                color: 'success',
                icon: <Check />,
                radius: 0,
                style: {
                    marginBottom: '.8rem',
                },
            })

            router.refresh()
            setTimeout(() => {
                document.getElementById('main-element')?.click()
            }, 500)
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
        <PopoverComponent
            actionButton={
                <Button
                    className="py-1.5 text-xs shadow-sm"
                    intent="secondary"
                    onClick={() => {
                        // If not change return do nothing ...
                        if (category.price.at(-1)!.price === price) return

                        // Create a new price object
                        const newPrice = {
                            from: new Date(),
                            price: price,
                            currency: 'ARS',
                        }

                        // Update the old price to set the 'to' property
                        const oldPrice = {
                            ...category.price[category.price.length - 1],
                        }
                        oldPrice.to = new Date()

                        // Create a new array of prices with the updated old price and new price
                        const updatedPrices = [
                            ...category.price.slice(
                                0,
                                category.price.length - 1
                            ),
                            oldPrice,
                            newPrice,
                        ] as HistoricCategoryPrice[]

                        // Create a new object with updated price information
                        const categoryUpdated = {
                            ...category,
                            price: updatedPrices,
                        }

                        // Call the updatePrice function with the updated category information
                        updatePrice(category.id, categoryUpdated)
                    }}
                >
                    Actualizar
                </Button>
            }
            title="Actualizar precio"
        >
            <div className="flex items-center gap-2">
                <p className="text-xs font-semibold">Precio actualizado:</p>
                <CurrencyInput
                    defaultPrice={
                        category.price[category.price.length - 1]?.price
                    }
                    className="min-w-[7rem] rounded-md py-1 text-xs"
                    priceSetter={(price: number) => setPrice(price)}
                />
            </div>
        </PopoverComponent>
    )
}
