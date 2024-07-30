'use client'

import type { Prisma } from '@prisma/client'
import TanStackTable from '@shared/data-table/tan-stack-table'
import { useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { Badge } from '@components/badge'
import { dateFormatter } from '@utils/formatters'
import { AnualBudgetStateDictionary } from '@utils/dictionaries/AnualBudgetStateDictionary'
import SearchBar from '@shared/data-table/search-bar'
import { useUpdateQuery } from '@utils/query-helper/updateQuery'
import { useSearchParams } from 'next/navigation'
import { Listbox, ListboxLabel, ListboxOption } from '@components/listbox'
import { useQuery } from '@tanstack/react-query'
import { getAnualBudgetYears } from '@repositories/anual-budget'

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

  return (
    <TanStackTable
      data={anualBudgets}
      columns={columns}
      totalRecords={totalRecords}
      initialVisibility={initialVisible}
      rowAsLinkPath="/anual-budgets/budget/"
    >
      <SearchBar placeholder="Buscar por: Nombre de protocolo, etc." />
      <BudgetYearFilter />
    </TanStackTable>
  )
}

function BudgetYearFilter() {
  const { data } = useQuery({
    queryKey: ['anual-budget-years'],
    queryFn: async () => await getAnualBudgetYears(),
  })
  const update = useUpdateQuery()
  const searchParams = useSearchParams()

  const years = Array.from(new Set(data?.map((y) => y.year.toString())))

  return (
    <Listbox
      placeholder="Año presupuestado"
      value={searchParams.get('year')}
      onChange={(value: string) => {
        update({
          year: value,
        })
      }}
    >
      {years.map((year) => (
        <ListboxOption key={year} value={year.toString()}>
          <ListboxLabel>{year}</ListboxLabel>
        </ListboxOption>
      ))}
    </Listbox>
  )
}
