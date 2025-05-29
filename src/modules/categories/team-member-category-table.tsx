'use client'

import type { TeamMemberCategory } from '@prisma/client'
import TanStackTable from '@shared/data-table/tan-stack-table'
import { useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { Currency } from '@shared/currency'
import SearchBar from '@shared/data-table/search-bar'
import { BadgeButton } from '@components/badge'
import { EditCategoryDialog } from './edit-category-dialog'

export default function CategoriesTable({
  categories,
  totalRecords,
<<<<<<< HEAD
  currentFCA,
=======
  currentFCA
>>>>>>> origin/develop
}: {
  categories: TeamMemberCategory[]
  totalRecords: number
  currentFCA: number
}) {
  const columns = useMemo<ColumnDef<TeamMemberCategory>[]>(
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
        header: 'Categoría',
        enableHiding: false,
      },
      {
        accessorKey: 'amountIndex',
        header: 'Valor hora',
        enableHiding: false,
        enableSorting: false,
<<<<<<< HEAD
        cell: ({ row }) => (
          <Currency
            defaultFCA={!Boolean(row.original.name == 'Obrero')}
            amountIndex={row.original.amountIndex!}
          />
        ),
=======
        cell: ({ row }) => <Currency amountIndex={row.original.amountIndex!} />,
>>>>>>> origin/develop
      },
      {
        accessorKey: 'action',
        header: '',
        cell: ({ row }) => (
          <EditCategoryDialog
            teamMemberCategory={row.original}
            currentFCA={currentFCA}
          />
        ),
        enableHiding: false,
        enableSorting: false,
      },
    ],
    []
  )
  const initialVisible = { id: false }

  return (
    <TanStackTable
      data={categories}
      columns={columns}
      totalRecords={totalRecords}
      initialVisibility={initialVisible}
    >
      <SearchBar placeholder="Buscar por: Nombre, etc." />
    </TanStackTable>
  )
}
