'use client'
import type { AnualBudget } from '@prisma/client'
import TanStackTable from '@elements/tan-stack-table'
import { useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

import { buttonStyle } from '@elements/button/styles'
import { cx } from '@utils/cx'

export default function AnualBudgetTable({
    anualBudgets,
    totalRecords,
}: {
    anualBudgets: AnualBudget[]
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
                accessorKey: 'protocol.sections.identification.title',
                header: 'Protocolo',
                enableHiding: false,
                cell: ({ row }) => {
                    return (
                        <>
                            <Link
                                target="_blank"
                                className="  transition-all duration-150 hover:text-primary"
                                href={`/protocols/${row.original.protocol.id}`}
                                title={
                                    row.original.protocol.sections
                                        .identification.title
                                }
                            >
                                {row.original.protocol.sections.identification
                                    .title.length <= 80
                                    ? row.original.protocol.sections
                                          .identification.title
                                    : row.original.protocol.sections.identification.title.slice(
                                          0,
                                          80
                                      ) + '...'}
                            </Link>
                        </>
                    )
                },
            },
            {
                accessorKey: 'year',
                header: 'Año',
                enableHiding: true,
            },

            {
                accessorKey: 'actions',
                header: 'Acciones',
                enableHiding: false,
                cell: ({ row }) => {
                    return (
                        <div className="flex gap-2">
                            <Link
                                passHref
                                className={cx(
                                    buttonStyle('secondary'),
                                    'px-2.5 py-1 text-xs'
                                )}
                                href={`/anual-budgets/${row.original.id}`}
                            >
                                Ver
                            </Link>
                        </div>
                    )
                },
            },
        ],
        []
    )
    const initialVisible = { id: false }

    return (
        <>
            <TanStackTable
                data={anualBudgets}
                columns={columns}
                totalRecords={totalRecords}
                initialVisibility={initialVisible}
                searchBarPlaceholder="Buscar por nombre de categoría"
            />
        </>
    )
}
