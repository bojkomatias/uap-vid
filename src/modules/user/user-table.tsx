'use client'
import type { User } from '@prisma/client'
// import { RoleUpdater } from './elements/role-updater'
// import { DeleteUserButton } from './elements/delete-user-button'
import TanStackTable from '@elements/tan-stack-table'
import type { ReactNode } from 'react'
import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import SearchBar from '@elements/search-bar'
import Pagination from '@elements/pagination'

export default function UserTable({
    users,
    page = 1,
    userCount,
}: {
    users: User[]
    page?: number
    userCount: number
}) {
    const columns = useMemo<ColumnDef<User>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
            },
            {
                accessorKey: 'name',
                header: 'Name',
                cell: ({ cell }) => (
                    <span className="text-success-400">
                        {cell.getValue() as ReactNode}
                    </span>
                ),
                enableHiding: false,
            },
            {
                accessorKey: 'email',
                header: 'Email',
            },
            {
                accessorKey: 'password',
                header: 'Origen de usuario',
                cell: ({ row }) =>
                    row.original.password ? <>Microsoft 365</> : <>Local</>,
                sortUndefined: 1,
            },
        ],
        []
    )
    return (
        <>
            <SearchBar
                url="/users"
                placeholderMessage="Buscar usuario por nombre, rol o email"
            />

            <TanStackTable data={users} columns={columns} />
            <Pagination
                url="/users"
                pageParams={page}
                count={userCount}
                shownRecords={8}
            />
        </>
    )
}
