'use client'
import type { Prisma, User } from '@prisma/client'
import { RoleUpdater } from './elements/role-updater'
import { DeleteUserButton } from './elements/delete-user-button'
import TanStackTable from '@elements/tan-stack-table'
import { useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import RolesDictionary from '@utils/dictionaries/RolesDictionary'

type UsersWithCount = Prisma.UserGetPayload<{
    include: { _count: true }
}>
/**
 * This component is meant to handle business logic
 * What are the values needed, and what the actions performed
 */

export default function UserTable({
    users,
    totalRecords,
    loggedInUser,
}: {
    users: UsersWithCount[]
    totalRecords: number
    loggedInUser: User
}) {
    const columns = useMemo<ColumnDef<UsersWithCount>[]>(
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
                accessorKey: 'email',
                header: 'Email',
                enableHiding: false,
            },
            {
                accessorKey: 'password',
                header: 'Origen',
                cell: ({ cell }) =>
                    cell.getValue() ? <>Microsoft 365</> : <>Usuario local</>,
            },
            {
                accessorKey: 'role',
                header: 'Rol',
                // Guard for not changing your own role.
                cell: ({ row }) =>
                    row.original.id === loggedInUser.id ? (
                        <></>
                    ) : (
                        <RoleUpdater user={row.original} />
                    ),
            },
            {
                accessorKey: '_count.protocols',
                id: 'protocols',
                header: 'Protocolos',
                cell: ({ row }) => (
                    <div className="w-20 text-right">
                        {row.original._count.protocols}
                    </div>
                ),
            },
            {
                accessorKey: '_count.Review',
                id: 'Review',
                header: 'Evaluaciones',
                cell: ({ row }) => (
                    <div className="w-20 text-right">
                        {row.original._count.Review}
                    </div>
                ),
            },
            {
                accessorKey: 'delete',
                header: 'Acciones',
                cell: ({ row }) =>
                    row.original.role === 'ADMIN' ? (
                        <></>
                    ) : (
                        <DeleteUserButton userId={row.original.id} />
                    ),
                enableHiding: false,
                enableSorting: false,
            },
        ],
        [loggedInUser.id]
    )
    /** Explicitly announce initial state of hidden columns. */
    const initialVisible = { id: false, protocols: false, Review: false }

    return (
        <>
            <TanStackTable
                data={users}
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
