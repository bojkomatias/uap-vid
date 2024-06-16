'use client'
import type { Prisma } from '@prisma/client'
import TanStackTable from '@shared/data-table/tan-stack-table'
import { useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { buttonStyle } from '@elements/button/styles'
import { Check, Minus } from 'tabler-icons-react'
import Currency from '@elements/currency'

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
        accessorKey: 'obrero',
        header: 'Obrero',
        cell: ({ row }) =>
          row.original.categories.at(-1)?.pointsObrero ?
            <Check className="ml-4 h-4 text-gray-600" />
          : <Minus className="ml-4 h-4 text-gray-600" />,
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
        id: 'category.name',
        accessorFn: (row) => row.categories.at(-1)?.category.name,
        header: 'Categoría',
        enableSorting: false,
      },
      {
        id: 'category.price',
        accessorFn: (row) => row.categories.at(-1)?.category.price.at(-1),
        header: 'Valor hora',
        cell: ({ row }) => (
          <Currency
            amount={
              row.original.categories.at(-1)?.category.price.at(-1)?.price
            }
            currency={
              row.original.categories.at(-1)?.category.price.at(-1)?.currency
            }
          />
        ),
        enableSorting: false,
      },
      {
        id: 'academicUnit',
        accessorFn: (row) => row.AcademicUnit?.name,
        header: 'Unidad Académica',
        enableSorting: true,
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
      />
    </>
  )
}
