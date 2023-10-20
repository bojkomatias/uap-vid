/* eslint-disable react/jsx-no-undef */
'use client'
import type { AcademicUnit, User } from '@prisma/client'
import type { ColumnDef } from '@tanstack/react-table'
import TanStackTable from '@elements/tan-stack-table'
import { dateFormatter } from '@utils/formatters'
import Currency from '@elements/currency'
import AcademicUnitView from './academic-unit-view'

export default function AcademicUnitsTable({
    academicUnits,
    secretaries,
    totalRecords,
}: {
    academicUnits: AcademicUnit[]
    secretaries: User[]
    totalRecords: number
}) {
    const columns: ColumnDef<AcademicUnit>[] = [
        {
            accessorKey: 'name',
            header: 'Unidad Académica',
            enableHiding: false,
            enableSorting: true,
        },
        {
            accessorKey: 'budgets',
            header: 'Presupuesto',
            enableHiding: true,
            enableSorting: false,
            cell: ({ row }) => (
                <>
                    <Currency
                        title={
                            row.original.budgets[
                                row.original.budgets.length - 1
                            ]
                                ? `Desde ${dateFormatter.format(
                                      row.original.budgets[
                                          row.original.budgets.length - 1
                                      ].from
                                  )} hasta el ${dateFormatter.format(
                                      row.original.budgets[
                                          row.original.budgets.length - 1
                                      ].to ?? new Date()
                                  )}`
                                : undefined
                        }
                        amount={
                            row.original.budgets[
                                row.original.budgets.length - 1
                            ]?.amount
                        }
                    />
                </>
            ),
        },

        {
            accessorKey: 'actions',
            header: 'Acciones',
            cell: ({ row }) => (
                <div className="flex items-center justify-between gap-1">
                    <AcademicUnitView
                        academicUnit={row.original}
                        secretaries={secretaries}
                    />
                </div>
            ),
            enableHiding: true,
            enableSorting: false,
        },
    ]

    return (
        <TanStackTable
            data={academicUnits}
            columns={columns}
            totalRecords={totalRecords}
            initialVisibility={{
                name: true,
                secretariesIds: true,
            }}
            searchBarPlaceholder="Buscar por nombre de categoría"
        />
    )
}
