'use client'

import type { Prisma, Role } from '@prisma/client'
import TanStackTable from '@shared/data-table/tan-stack-table'
import { useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import {
  RolesColorDictionary,
  RolesDictionary,
} from '@utils/dictionaries/RolesDictionary'
import SearchBar from '@shared/data-table/search-bar'
import { Badge } from '@components/badge'
import { Listbox, ListboxLabel, ListboxOption } from '@components/listbox'
import { useUpdateQuery } from '@utils/query-helper/updateQuery'
import { useSearchParams } from 'next/navigation'
import { ImpersonateUserButton } from './impersonate-user-button'

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
        cell: ({ row }) => (
          <Badge color={RolesColorDictionary[row.original.role]}>
            {RolesDictionary[row.original.role]}
          </Badge>
        ),
      },
      {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => (
          <ImpersonateUserButton
            userId={row.original.id}
            userName={row.original.name}
          />
        ),
        enableSorting: false,
        enableHiding: false,
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
    >
      <SearchBar placeholder="Buscar por: Nombre, Email, etc." />
      <RoleFilter />
    </TanStackTable>
  )
}

function RoleFilter() {
  const update = useUpdateQuery()
  const searchParams = useSearchParams()

  const states = Object.keys(RolesDictionary) as Role[]
  return (
    <Listbox
      placeholder="Rol de usuario"
      value={searchParams.get('role')}
      onChange={(value: string) => {
        update({
          role: value,
        })
      }}
    >
      {states.map((e) => (
        <ListboxOption key={e} value={e}>
          <ListboxLabel>{RolesDictionary[e]}</ListboxLabel>
        </ListboxOption>
      ))}
    </Listbox>
  )
}
