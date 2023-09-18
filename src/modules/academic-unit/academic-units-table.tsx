/* eslint-disable react/jsx-no-undef */
'use client'
import type { AcademicUnit, User } from '@prisma/client'
import type { ColumnDef } from '@tanstack/react-table'
import TanStackTable from '@elements/tan-stack-table'
import { dateFormatter } from '@utils/formatters'
import Currency from '@elements/currency'
import AcademicUnitView from './academic-unit-view'
import { SecretaryMultipleSelect } from './secretary-multiple-select'
import { Button } from '@elements/button'
import CurrencyInput from '@elements/currency-input'

export default async function AcademicUnitsTable({
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
                    <AcademicUnitView academicUnit={row.original}>
                        {' '}
                        <p className="text-sm text-gray-600">
                            Editar secretarios/as
                        </p>
                        <SecretaryMultipleSelect
                            className=" max-w-lg text-gray-500"
                            currentSecretaries={row.original.secretariesIds}
                            secretaries={secretaries}
                            unitId={row.original.id}
                        />
                        <p className="text-sm text-gray-600">
                            Actualizar presupuesto:
                        </p>
                        <div className="flex  items-center gap-2">
                            <CurrencyInput
                                defaultPrice={
                                    row.original.budgets[
                                        row.original.budgets.length - 1
                                    ]?.amount ?? 0
                                }
                                className="min-w-[7rem] rounded-md py-1 text-xs"
                                priceSetter={() => {}}
                            />

                            <Button
                                className="py-1.5 text-xs shadow-sm"
                                intent="secondary"
                                onClick={(e) => {
                                    e.preventDefault()
                                    updateBudget(row.original)
                                }}
                            >
                                Actualizar
                            </Button>
                        </div>
                        <p className="text-sm text-gray-600">
                            Presupuestos históricos:
                        </p>
                        <table className="table-auto text-sm text-gray-600">
                            <thead>
                                <tr className="text-left ">
                                    <th className="font-semibold">
                                        Presupuesto
                                    </th>
                                    <th className="font-semibold">Desde</th>
                                    <th className="font-semibold">Hasta</th>
                                </tr>
                            </thead>
                            <tbody>
                                {row.original.budgets
                                    .slice(0, row.original.budgets.length - 1)
                                    .reverse()
                                    .map((budget, idx) => {
                                        return (
                                            <>
                                                <tr key={idx}>
                                                    <td className="pt-2">
                                                        <Currency
                                                            amount={
                                                                budget.amount
                                                            }
                                                        />
                                                    </td>
                                                    <td>
                                                        {budget.from.toLocaleDateString()}
                                                    </td>
                                                    <td>
                                                        {budget.to?.toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            </>
                                        )
                                    })}
                            </tbody>
                        </table>
                    </AcademicUnitView>
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
