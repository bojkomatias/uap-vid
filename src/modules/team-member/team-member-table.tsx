'use client'
import type { Prisma } from '@prisma/client'
import TanStackTable from '@shared/data-table/tan-stack-table'
import { useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { Check, Minus } from 'tabler-icons-react'
import { Currency } from '@shared/currency'
import { BadgeButton } from '@components/badge'

type TeamMember = Prisma.TeamMemberGetPayload<{
  include: {
    user: { select: { id: true; name: true; email: true; role: true } }
    categories: { include: { category: true } }
    AcademicUnit: { select: { name: true } }
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
        accessorKey: 'user.email',
        header: 'Email',
      },
      {
        id: 'category.name',
        accessorFn: (row) => row.categories.at(-1)?.category.name,
        header: 'Categoría',
        enableSorting: false,
      },
      {
        accessorKey: 'pointsObrero',
        header: 'Puntos',
        cell: ({ row }) => (
          <span className="ml-4">
            {row.original.categories.at(-1)?.pointsObrero}
          </span>
        ),
        enableSorting: false,
      },
      {
        id: 'category.price',
        accessorFn: (row) => row.categories.at(-1)?.category.amountIndex,
        header: 'Valor categoría',
        cell: ({ row }) => (
          <>
            {row.original.categories.at(-1) ?
              <Currency
                amountIndex={
                  row.original.categories.at(-1)!.category.amountIndex
                }
              />
            : null}
          </>
        ),
        enableSorting: false,
      },
      {
        id: 'academicUnit',
        accessorFn: (row) => row.AcademicUnit?.name,
        header: 'Unidad Académica',
        enableSorting: true,
      },
      {
        accessorKey: 'action',
        header: '',
        cell: ({ row }) => (
          <BadgeButton href={`/team-members/categorize/${row.original.id}`}>
            Categorizar
          </BadgeButton>
        ),
        enableHiding: false,
        enableSorting: false,
      },
    ],
    []
  )
  /** Explicitly announce initial state of hidden columns. */
  const initialVisible = {
    id: false,
    academicUnit: false,
    pointsObrero: false,
  }

  return (
    <>
      <TanStackTable
        data={teamMembers}
        columns={columns}
        totalRecords={totalRecords}
        initialVisibility={initialVisible}
        searchBarPlaceholder="Buscar por: Nombre, etc"
        rowAsLinkPath="/team-members/member/"
      />
    </>
  )
}
