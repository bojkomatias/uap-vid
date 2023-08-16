'use client'
import type { User } from '@prisma/client'
import { RoleUpdater } from './elements/role-updater'
import { DeleteUserButton } from './elements/delete-user-button'
import TanStackTable from '@elements/tan-stack-table'
import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

/**
 * This component is meant to handle business logic
 * What are the values needed, and what the actions performed
 */

export default function UserTable({
    users,
    userCount,
    loggedInUser,
}: {
    users: User[]
    userCount: number
    loggedInUser: User
}) {
    const columns = useMemo<ColumnDef<User>[]>(
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
                enableHiding: false,
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

    return (
        <>
            <TanStackTable
                data={users}
                columns={columns}
                totalRecords={userCount}
                initialVisibility={{ id: false }}
            />
        </>
    )
}
