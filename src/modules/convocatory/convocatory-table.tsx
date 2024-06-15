'use client'

import { buttonStyle } from '@elements/button/styles'
import TanStackTable from '@elements/tan-stack-table'
import type { Convocatory } from '@prisma/client'
import type { ColumnDef } from '@tanstack/react-table'
import { dateFormatter } from '@utils/formatters'
import Link from 'next/link'

export function ConvocatoryTable({
  convocatories,
  totalRecords,
  currentConvocatory,
}: {
  convocatories: Convocatory[]
  totalRecords: number
  currentConvocatory: Convocatory
}) {
  const columns: ColumnDef<Convocatory>[] = [
    {
      accessorKey: 'id',
      header: '#',
      enableHiding: false,
      enableSorting: true,
    },
    {
      accessorKey: 'name',
      header: 'Nombre',
      enableHiding: true,
      enableSorting: false,
    },
    {
      accessorKey: 'year',
      header: 'Año',
      enableHiding: true,
      enableSorting: false,
    },
    {
      accessorKey: 'from',
      header: 'Desde',

      enableHiding: true,
      enableSorting: false,
      cell: ({ row }) => <>{dateFormatter.format(row.original.from)}</>,
    },
    {
      accessorKey: 'to',
      header: 'Hasta',

      enableHiding: true,
      enableSorting: false,
      cell: ({ row }) => <>{dateFormatter.format(row.original.to)}</>,
    },
    {
      accessorKey: 'isCurrent',
      header: 'Actual',
      enableHiding: true,
      enableSorting: false,
      cell: ({ row }) => {
        {
          currentConvocatory && currentConvocatory.id === row.original.id ? (
            <span className="rounded border bg-gray-50 px-3 py-px text-xs uppercase">
              actual
            </span>
          ) : null
        }
      },
    },
    {
      accessorKey: 'actions',
      header: 'Ver',
      enableHiding: false,
      enableSorting: false,
      cell: ({ row }) => (
        <Link
          href={`/convocatories/edit/${row.original.id}`}
          className={buttonStyle('secondary', 'xs')}
        >
          Ver
        </Link>
      ),
    },
  ]

  return (
    <TanStackTable
      data={convocatories}
      columns={columns}
      totalRecords={totalRecords}
      searchBarPlaceholder="Buscar por nombre de convocatoria"
      initialVisibility={{
        name: true,
        year: true,
        from: false,
        to: false,
        id: false,
        isCurrent: false,
      }}
    />
  )
}
