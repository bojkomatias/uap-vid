'use client'

import type { Prisma } from '@prisma/client'
import TanStackTable from '@shared/data-table/tan-stack-table'
import { useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import RolesDictionary from '@utils/dictionaries/RolesDictionary'
import SearchBar from '@shared/data-table/search-bar'

type UserWithCount = Prisma.UserGetPayload<{
  include: { _count: true }
}>
/**
 * This component is meant to handle business logic
 * What are the values needed, and what the actions performed
 */

export default function UserTable({
  users,
  totalRecords,
}: {
  users: UserWithCount[]
  totalRecords: number
}) {
  const columns = useMemo<ColumnDef<UserWithCount>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        cell: ({ row }) => (
          <span className="text-xs text-gray-600">{row.original.id}</span>
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
          cell.getValue() ? <>Usuario local</> : <>Microsoft 365</>,
      },
      {
        accessorKey: '_count.protocols',
        id: 'protocols',
        header: 'Protocolos',
        cell: ({ row }) => (
          <div className="w-20 text-right">{row.original._count.protocols}</div>
        ),
      },
      {
        accessorKey: '_count.Review',
        id: 'Review',
        header: 'Evaluaciones',
        cell: ({ row }) => (
          <div className="w-20 text-right">{row.original._count.Review}</div>
        ),
      },
      {
        accessorKey: 'role',
        header: 'Rol',
        cell: ({ row }) => <span>{RolesDictionary[row.original.role]} </span>,
      },
    ],
    []
  )
  /** Explicitly announce initial state of hidden columns. */
  const initialVisible = { id: false, protocols: false, Review: false }

  return (
    <TanStackTable
      data={users}
      columns={columns}
      totalRecords={totalRecords}
      initialVisibility={initialVisible}
      rowAsLinkPath="/users/edit/"
      // filterableByKey={{
      //   filter: 'role',
      //   values: Object.entries(RolesDictionary),
      // }}
    >
      <SearchBar placeholder="buscar" />
    </TanStackTable>
  )
}
