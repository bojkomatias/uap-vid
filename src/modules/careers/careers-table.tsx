'use client'

import TanStackTable from '@shared/data-table/tan-stack-table'
import type { Career } from '@prisma/client'
import type { ColumnDef } from '@tanstack/react-table'
import SearchBar from '@shared/data-table/search-bar'

export function CareerTable({
  careers,
  totalRecords,
}: {
  careers: Career[]
  totalRecords: number
}) {
  const columns: ColumnDef<Career>[] = [
    {
      accessorKey: 'id',
      header: '#',
      enableHiding: true,
      enableSorting: true,
    },
    {
      accessorKey: 'name',
      header: 'Nombre',
      enableHiding: false,
      enableSorting: true,
    },
    {
      accessorKey: 'active',
      header: 'Estado',
      enableHiding: false,
      enableSorting: true,
      cell: ({ row }) => {
        return row.original.active ? 'Activa' : 'Inactiva'
      },
    },
  ]

  return (
    <TanStackTable
      data={careers}
      columns={columns}
      totalRecords={totalRecords}
      rowAsLinkPath="/careers/edit/"
      initialVisibility={{
        name: true,
        id: false,
      }}
    >
      <SearchBar placeholder="Buscar" />
    </TanStackTable>
  )
}
