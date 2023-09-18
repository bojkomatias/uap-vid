import { Button } from '@elements/button'
import CurrencyInput, { parseLocaleNumber } from '@elements/currency-input'
import PopoverComponent from '@elements/popover'
import { notifications } from '@mantine/notifications'
import type { HistoricCategoryPrice, TeamMemberCategory } from '@prisma/client'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Check, X } from 'tabler-icons-react'

export default function PriceUpdate({ row }: { row: any }) {
    const router = useRouter()
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
                        // Get the input value and parse the price
                        const priceInput = document.getElementById(
                            'price-input'
                        ) as HTMLInputElement
                        const price = parseLocaleNumber(
                            priceInput.value,
                            'es-AR'
                        )

                        // Create a new price object
                        const newPrice = {
                            from: new Date(),
                            price: price,
                            currency: 'ARS',
                        }

                        // Update the old price to set the 'to' property
                        const oldPrice = {
                            ...row.original.price[
                                row.original.price.length - 1
                            ],
                        }
                        oldPrice.to = new Date()

                        console.log('oldPriceeeee', oldPrice.price)

                        // Create a new array of prices with the updated old price and new price. Although no one should ever create a new category without a value (price), if for some reason there's a category without an specified value, I made the logic to support that scenario.
                        const updatedPrices = oldPrice.price
                            ? ([
                                  ...row.original.price.slice(
                                      0,
                                      row.original.price.length - 1
                                  ),
                                  oldPrice,
                                  newPrice,
                              ] as HistoricCategoryPrice[])
                            : ([
                                  ...row.original.price.slice(
                                      0,
                                      row.original.price.length - 1
                                  ),

                                  newPrice,
                              ] as HistoricCategoryPrice[])

                        // Create a new object with updated price information
                        const categoryUpdated = {
                            ...row.original,
                            price: updatedPrices,
                        }

                        // Call the updatePrice function with the updated category information
                        updatePrice(row.original.id, categoryUpdated)
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
                        row.original.price[row.original.price.length - 1]?.price
                    }
                    className="min-w-[7rem] rounded-md py-1 text-xs"
                />
            </div>
        </PopoverComponent>
    )
}
