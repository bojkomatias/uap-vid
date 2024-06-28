'use client'

import TanStackTable from '@shared/data-table/tan-stack-table'
import type { Career } from '@prisma/client'
import type { ColumnDef } from '@tanstack/react-table'

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
  ]

  return (
    <TanStackTable
      data={careers}
      columns={columns}
      totalRecords={totalRecords}
      searchBarPlaceholder="Buscar por nombre de carrera"
      rowAsLinkPath="/careers/edit/"
      initialVisibility={{
        name: true,
        id: false,
      }}
    />
  )
}
