/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import type { TeamMemberCategory } from '@prisma/client'
import TanStackTable from '@elements/tan-stack-table'
import { useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { DeleteButton } from '@protocol/elements/action-buttons/delete'
import { buttonStyle } from '@elements/button/styles'
import { cx } from '@utils/cx'

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
            {
                accessorKey: 'actions',
                header: 'Acciones',
                cell: ({ row }) => (
                    <div className="flex items-center justify-between gap-1">
                        <Link
                            href={`/protocols/${row.original.id}`}
                            passHref
                            className={cx(
                                buttonStyle('secondary'),
                                'px-2.5 py-1 text-xs'
                            )}
                        >
                            Ver
                        </Link>

                        <DeleteButton
                            protocolId={row.original.id}
                            protocolState={row.original.state}
                            className={'px-2.5 py-1 text-xs'}
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
