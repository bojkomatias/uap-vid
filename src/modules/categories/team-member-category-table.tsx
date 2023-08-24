/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import type { HistoricCategoryPrice, TeamMemberCategory } from '@prisma/client'
import TanStackTable from '@elements/tan-stack-table'
import { useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { DeleteButton } from '@protocol/elements/action-buttons/delete'
import PopoverButton from '@elements/popover'
import CurrencyInput, { parseLocaleNumber } from '@elements/currency-input'
import { Button } from '@elements/button'
import { notifications } from '@mantine/notifications'
import { useRouter } from 'next/navigation'
import { Check, X } from 'tabler-icons-react'

export default function CategoriesTable({
    categories,
    totalRecords,
}: {
    categories: TeamMemberCategory[]
    totalRecords: number
}) {
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
            router.push('/categories')
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
    const columns = useMemo<ColumnDef<any>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'Id',
                cell: ({ row }) => (
                    <span className="text-xs text-gray-600">
                        {row.original.id}
                    </span>
                ),
                enableSorting: false,
            },
            {
                accessorKey: 'name',
                header: 'Categoría',
                enableHiding: false,
            },

            {
                accessorKey: 'price',
                header: 'Precio hora',
                enableHiding: false,
                cell: ({ row }) => (
                    <span className="min-w-[500px] text-xs text-gray-600">
                        {
                            row.original.price[row.original.price.length - 1]
                                ?.price
                        }{' '}
                        {
                            row.original.price[row.original.price.length - 1]
                                ?.currency
                        }
                    </span>
                ),
            },

            {
                accessorKey: 'actions',
                header: 'Acciones',
                cell: ({ row }) => (
                    <div className="flex items-center justify-between gap-1">
                        <PopoverButton title="Actualizar precio">
                            <div className="flex items-center gap-2">
                                <p className="text-xs font-semibold">
                                    Precio actualizado:
                                </p>
                                <CurrencyInput
                                    defaultPrice={
                                        row.original.price[
                                            row.original.price.length - 1
                                        ]?.price
                                    }
                                    className="min-w-[7rem] rounded-md py-1 text-xs"
                                    priceSetter={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                        //Esta función es obligatoria y la verdad me dió fiaca modificar el componente original
                                        return e
                                    }}
                                />
                                <Button
                                    className="py-1.5 text-xs shadow-sm"
                                    intent="secondary"
                                    onClick={() => {
                                        // Get the input value and parse the price
                                        const priceInput =
                                            document.getElementById(
                                                'price-input'
                                            ) as HTMLInputElement
                                        const price = parseLocaleNumber(
                                            priceInput.value,
                                            'de-DE'
                                        )

                                        // Create a new price object
                                        const newPrice = {
                                            from: new Date(),
                                            price: price,
                                            currency: 'ARS',
                                        } as HistoricCategoryPrice

                                        // Update the old price to set the 'to' property
                                        const oldPrice = {
                                            ...row.original.price[
                                                row.original.price.length - 1
                                            ],
                                        }
                                        oldPrice.to = new Date()

                                        // Create a new array of prices with the updated old price and new price
                                        const updatedPrices = [
                                            ...row.original.price.slice(
                                                0,
                                                row.original.price.length - 1
                                            ),
                                            oldPrice,
                                            newPrice,
                                        ] as HistoricCategoryPrice[]

                                        // Create a new object with updated price information
                                        const categoryUpdated = {
                                            ...row.original,
                                            price: updatedPrices,
                                        }

                                        // Call the updatePrice function with the updated category information
                                        updatePrice(
                                            row.original.id,
                                            categoryUpdated
                                        )
                                    }}
                                >
                                    Actualizar
                                </Button>
                            </div>
                        </PopoverButton>
                        <DeleteButton
                            id={row.original.id}
                            State={false}
                            data={row.original}
                            apiPath="/categories"
                            className={'px-2.5 py-1 text-xs'}
                            notificationTitle="Categoría eliminada"
                            notificationMessage="La categoría fue eliminada con éxito"
                        />
                    </div>
                ),
                enableHiding: false,
                enableSorting: false,
            },
        ],
        []
    )
    const initialVisible = { id: false }

    return (
        <>
            <TanStackTable
                data={categories}
                columns={columns}
                totalRecords={totalRecords}
                initialVisibility={initialVisible}
                searchBarPlaceholder="Buscar por nombre de categoría"
            />
        </>
    )
}
