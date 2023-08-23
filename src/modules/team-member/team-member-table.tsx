'use client'
import type { Prisma } from '@prisma/client'
import TanStackTable from '@elements/tan-stack-table'
import { useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import RolesDictionary from '@utils/dictionaries/RolesDictionary'
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
                id: 'categories_0.category.name',
                accessorFn: (row) => row.categories[0]?.category.name,
                header: 'Categoría',
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
                filterableByKey={{
                    filter: 'role',
                    values: Object.entries(RolesDictionary),
                }}
                searchBarPlaceholder="Buscar por: Nombre, Email"
            />
        </>
    )
}
