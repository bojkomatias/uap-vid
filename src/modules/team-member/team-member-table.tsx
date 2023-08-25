'use client'
import type { Prisma } from '@prisma/client'
import TanStackTable from '@elements/tan-stack-table'
import { useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { cx } from '@utils/cx'
import { buttonStyle } from '@elements/button/styles'

type TeamMember = Prisma.TeamMemberGetPayload<{
    include: {
        user: { select: { id: true; name: true; email: true; role: true } }
        categories: { include: { category: true } }
    }
}>
/**
 * This component is meant to handle business logic
 * What are the values needed, and what the actions performed
 */

export default function TeamMemberTable({
    teamMembers,
    totalRecords,
}: {
    teamMembers: TeamMember[]
    totalRecords: number
}) {
    const columns = useMemo<ColumnDef<TeamMember>[]>(
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
                header: 'Nombre',
                enableHiding: false,
            },
            {
                accessorKey: 'user.email',
                header: 'Email',
            },
            {
                accessorKey: 'obrero',
                header: 'Obrero',
            },
            {
                id: 'points',
                header: 'Puntos',
            },
            {
                id: 'category.name',
                accessorFn: (row) => row.categories.at(-1)?.category.name,
                header: 'Categoría',
                enableSorting: false,
            },
            {
                id: 'category.price',
                accessorFn: (row) =>
                    row.categories.at(-1)?.category.price.at(-1),
                header: 'Valor hora',
                cell: ({ row }) => (
                    <span className='ml-4 before:content-["$"]'>
                        {
                            row.original.categories
                                .at(-1)
                                ?.category.price.at(-1)?.price
                        }
                        <span className="mx-1 text-xs text-gray-500">
                            {
                                row.original.categories
                                    .at(-1)
                                    ?.category.price.at(-1)?.currrency
                            }
                        </span>
                    </span>
                ),
                enableSorting: false,
            },
            {
                accessorKey: 'actions',
                header: 'Acciones',
                cell: ({ row }) => (
                    <Link
                        href={`/team-members/${row.original.id}`}
                        passHref
                        className={cx(
                            buttonStyle('secondary'),
                            'px-2.5 py-1 text-xs'
                        )}
                    >
                        Ver
                    </Link>
                ),
                enableHiding: false,
                enableSorting: false,
            },
        ],
        []
    )
    /** Explicitly announce initial state of hidden columns. */
    const initialVisible = { id: false }

    return (
        <>
            <TanStackTable
                data={teamMembers}
                columns={columns}
                totalRecords={totalRecords}
                initialVisibility={initialVisible}
                searchBarPlaceholder="Buscar por: Nombre, etc"
            />
        </>
    )
}
