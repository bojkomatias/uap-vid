/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import type { TeamMemberCategory } from '@prisma/client'
import TanStackTable from '@elements/tan-stack-table'
import { useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'

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
                cell: ({ row }) => (
                    <span className="min-w-[500px] text-xs text-gray-600">
                        {row.original.price[0]?.price}{' '}
                        {row.original.price[0]?.currency}
                    </span>
                ),
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
