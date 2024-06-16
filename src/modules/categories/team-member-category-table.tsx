'use client'
import type { TeamMemberCategory } from '@prisma/client'
import TanStackTable from '@shared/data-table/tan-stack-table'
import { useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import PriceUpdate from './price-update'
import TeamMemberCategoryView from './team-member-category-view'
import Currency from '@elements/currency'

export default function CategoriesTable({
  categories,
  totalRecords,
}: {
  categories: TeamMemberCategory[]
  totalRecords: number
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns = useMemo<ColumnDef<any>[]>(
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
        accessorKey: 'price',
        header: 'Valor hora',
        enableHiding: false,
        enableSorting: false,
        cell: ({ row }) => (
          <Currency
            amount={row.original.price[row.original.price.length - 1]?.price}
            currency={
              row.original.price[row.original.price.length - 1]?.currency
            }
          />
        ),
      },
      {
        accessorKey: 'actions',
        header: 'Acciones',
        cell: ({ row }) => (
          <div className="relative flex items-center justify-end gap-1">
            {row.original.price.length > 1 && (
              <TeamMemberCategoryView teamMemberCategory={row.original} />
            )}
            <PriceUpdate category={row.original} />
          </div>
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
      searchBarPlaceholder="Buscar por nombre de categoría"
      enableRowAsLink={false}
    />
  )
}
