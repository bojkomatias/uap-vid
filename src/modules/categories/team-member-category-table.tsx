/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import type { TeamMemberCategory } from '@prisma/client'
import TanStackTable from '@elements/tan-stack-table'
import { useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { DeleteButton } from '@protocol/elements/action-buttons/delete'

import { Badge } from '@elements/badge'
import { formatCurrency } from '@utils/formatters'
import PriceUpdate from './price-update'
import TeamMemberCategoryView from './team-member-category-view'

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
                header: 'Valor hora',
                enableHiding: false,
                enableSorting: false,
                cell: ({ row }) => (
                    <Badge className=" text-xs text-gray-600">
                        $
                        {formatCurrency(
                            (
                                row.original.price[
                                    row.original.price.length - 1
                                ]?.price * 100
                            ).toString()
                        )}{' '}
                        {
                            row.original.price[row.original.price.length - 1]
                                ?.currency
                        }
                    </Badge>
                ),
            },

            {
                accessorKey: 'actions',
                header: 'Acciones',
                cell: ({ row }) => (
                    <div className="relative flex items-center justify-end gap-1">
                        {row.original.price.length > 1 && (
                            <TeamMemberCategoryView
                                teamMemberCategory={row.original}
                            />
                        )}
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
