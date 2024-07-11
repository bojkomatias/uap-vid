'use client'

import TanStackTable from '@shared/data-table/tan-stack-table'
import type { ReviewQuestion } from '@prisma/client'
import type { ColumnDef } from '@tanstack/react-table'

import React from 'react'

export default function EvaluationsTable({
  questions,
  totalRecords,
}: {
  questions: ReviewQuestion[]
  totalRecords: number
}) {
  const columns: ColumnDef<ReviewQuestion>[] = [
    {
      accessorKey: 'id',
      header: '#',
      enableHiding: true,
      enableSorting: true,
    },
    {
      accessorKey: 'question',
      header: 'Pregunta',
      enableHiding: false,
      enableSorting: true,
    },
    {
      accessorKey: 'active',
      header: 'Estado',
      enableHiding: false,
      enableSorting: true,
      cell: ({ row }) => {
        return <div>{row.original.active}</div>
      },
    },
  ]
  return (
    <TanStackTable
      data={questions}
      columns={columns}
      totalRecords={totalRecords}
      searchBarPlaceholder="Buscar por contenido de la pregunta"
      rowAsLinkPath="/evaluations/edit/"
      initialVisibility={{
        id: false,
        question: true,
        active: true,
      }}
    />
  )
}
