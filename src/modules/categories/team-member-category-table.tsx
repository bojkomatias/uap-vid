/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import type { HistoricCategoryPrice, TeamMemberCategory } from '@prisma/client'
import TanStackTable from '@elements/tan-stack-table'
import { useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { DeleteButton } from '@protocol/elements/action-buttons/delete'
import PopoverComponent from '@elements/popover'
import CurrencyInput, { parseLocaleNumber } from '@elements/currency-input'
import { Button } from '@elements/button'

import { Badge } from '@elements/badge'
import { dateFormatter } from '@utils/formatters'
import PriceUpdate from './price-update'

export default function CategoriesTable({
    categories,
    totalRecords,
}: {
    categories: TeamMemberCategory[]
    totalRecords: number
}) {
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
                enableSorting: false,
                cell: ({ row }) => (
                    <Badge className=" text-xs text-gray-600">
                        $
                        {
                            row.original.price[row.original.price.length - 1]
                                ?.price
                        }{' '}
                        {
                            row.original.price[row.original.price.length - 1]
                                ?.currency
                        }
                    </Badge>
                ),
            },

            {
                id: 'historic-prices',
                header: 'Precios históricos',
                enableHiding: false,
                enableSorting: false,
                cell: ({ row }) => (
                    <span className="flex min-w-[500px] gap-2 text-xs text-gray-600">
                        {row.original.price
                            .slice(0, row.original.price.length - 1)
                            .reverse()
                            .map((p: any, idx: number) => {
                                return (
                                    <Badge key={idx}>
                                        <span
                                            title={`Desde ${dateFormatter.format(
                                                p.from
                                            )} hasta el ${dateFormatter.format(
                                                p.to
                                            )}`}
                                        >
                                            ${p.price} {p.currency}
                                        </span>
                                    </Badge>
                                )
                            })}
                    </span>
                ),
            },

            {
                accessorKey: 'actions',
                header: 'Acciones',
                cell: ({ row }) => (
                    <div className="flex items-center justify-between gap-1">
                        <PriceUpdate row={row} />
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
