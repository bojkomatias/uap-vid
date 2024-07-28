'use client'
import type { Prisma } from '@prisma/client'
import TanStackTable from '@shared/data-table/tan-stack-table'
import { useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { Badge } from '@components/badge'
import { dateFormatter } from '@utils/formatters'
import { BudgetYearCombobox } from '@elements/years-combobox'
import AnualBudgetStateDictionary from '@utils/dictionaries/AnualBudgetStateDictionary'
import SearchBar from '@shared/data-table/search-bar'

type CustomAnualBudget = Prisma.AnualBudgetGetPayload<{
  select: {
    id: true
    createdAt: true
    state: true
    year: true
    protocol: true
  }
}>

export default function AnualBudgetTable({
  anualBudgets,
  totalRecords,
}: {
  anualBudgets: CustomAnualBudget[]
  totalRecords: number
}) {
  const columns = useMemo<ColumnDef<CustomAnualBudget>[]>(
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
        accessorKey: 'createdAt',
        header: 'Fecha de creación',
        cell: ({ row }) => (
          <span className="text-xs text-gray-600">
            {dateFormatter.format(row.original.createdAt)}
          </span>
        ),
      },
      {
        accessorKey: 'protocol.sections.identification.title',
        header: 'Protocolo',
        enableHiding: false,
        cell: ({ row }) => {
          return (
            <>
              <Link
                target="_blank"
                className="transition-all duration-150 hover:text-primary"
                href={`/protocols/${row.original.protocol.id}`}
                title={row.original.protocol.sections.identification.title}
              >
                {(
                  row.original.protocol.sections.identification.title.length <=
                  80
                ) ?
                  row.original.protocol.sections.identification.title
                : row.original.protocol.sections.identification.title.slice(
                    0,
                    60
                  ) + '...'
                }
              </Link>
            </>
          )
        },
      },
      {
        accessorKey: 'approved',
        header: 'Estado',
        cell: ({ row }) => (
          <Badge>{AnualBudgetStateDictionary[row.original.state]}</Badge>
        ),
        enableHiding: true,
      },
      {
        accessorKey: 'year',
        header: 'Año',
        enableHiding: true,
      },
    ],
    []
  )
  const initialVisible = { id: false, createdAt: false }

  const yearFilter = () => {
    return <BudgetYearCombobox />
  }

  return (
    <TanStackTable
      data={anualBudgets}
      columns={columns}
      totalRecords={totalRecords}
      initialVisibility={initialVisible}
      // customFilterSlot2={yearFilter()}
      rowAsLinkPath="/anual-budgets/budget/"
    >
      <SearchBar placeholder="Buscar" />
    </TanStackTable>
  )
}
