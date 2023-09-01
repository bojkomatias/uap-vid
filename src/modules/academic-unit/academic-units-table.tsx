'use client'
import type { AcademicUnit, User } from '@prisma/client'
import { SecretaryMultipleSelect } from './secretary-multiple-select'
import type { ColumnDef } from '@tanstack/react-table'
import TanStackTable from '@elements/tan-stack-table'
import { Badge } from '@elements/badge'
import { dateFormatter } from '@utils/formatters'
import { notifications } from '@mantine/notifications'
import { Button } from '@elements/button'
import PopoverButton from '@elements/popover'
import CurrencyInput, { parseLocaleNumber } from '@elements/currency-input'
import { useRouter } from 'next/navigation'
import { Check, X } from 'tabler-icons-react'
export default async function AcademicUnitsTable({
    academicUnits,
    secretaries,
}: {
    academicUnits: AcademicUnit[]
    secretaries: User[]
}) {
    const router = useRouter()

    const updateBudget = async (academicUnit: AcademicUnit) => {
        // Get the input value and parse the price
        const priceInput = document.getElementById(
            'price-input'
        ) as HTMLInputElement
        const newAmount = parseLocaleNumber(priceInput.value, 'de-DE')

        // Create a new budget object
        const newBudget = {
            from: new Date(),
            amount: newAmount,
        }

        // Update the old price to set the 'to' property
        const oldBudget = academicUnit.budgets[academicUnit.budgets.length - 1]
            ? {
                  ...academicUnit.budgets[academicUnit.budgets.length - 1],
                  to: new Date(),
              }
            : {
                  amount: 0,
                  from: new Date(0),
                  to: new Date(),
              }

        // Create a new array of prices with the updated old price and new price
        const updatedBudgets = [
            ...academicUnit.budgets.slice(0, academicUnit.budgets.length - 1),
            oldBudget,
            newBudget,
        ]

        // Create a new object with updated price information
        const academicUnitUpdated = {
            ...academicUnit,
            budgets: updatedBudgets,
        }

        const res = await fetch(`/api/academic-units/${academicUnit.id}`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(academicUnitUpdated),
        })
        if (res.status === 200) {
            notifications.show({
                title: 'Presupuesto actualizado',
                message: 'El presupuesto fue actualizado correctamente',
                color: 'success',
                icon: <Check />,
                radius: 0,
                style: {
                    marginBottom: '.8rem',
                },
            })

            router.refresh()
        } else if (res.status === 422) {
            notifications.show({
                title: 'Error',
                message: 'No se pudo actualizar el precio',
                color: 'red',
                icon: <X />,
                radius: 0,
                style: {
                    marginBottom: '.8rem',
                },
            })
        }
    }
    const columns: ColumnDef<AcademicUnit>[] = [
        {
            accessorKey: 'name',
            header: 'Unidad Academica',
            enableHiding: false,
            enableSorting: true,
        },
        {
            accessorKey: 'price',
            header: 'Presupuesto',
            enableHiding: false,
            enableSorting: false,
            cell: ({ row }) => (
                <Badge
                    className=" text-xs text-gray-600"
                    title={
                        row.original.budgets[row.original.budgets.length - 1]
                            ? `Desde ${dateFormatter.format(
                                  row.original.budgets[
                                      row.original.budgets.length - 1
                                  ].from
                              )} hasta el ${dateFormatter.format(
                                  row.original.budgets[
                                      row.original.budgets.length - 1
                                  ].to
                              )}`
                            : undefined
                    }
                >
                    $
                    {row.original.budgets[row.original.budgets.length - 1]
                        ?.amount ?? 0}
                </Badge>
            ),
        },
        {
            accessorKey: 'actions',
            header: 'Acciones',
            cell: ({ row }) => (
                <div className="flex items-center justify-between gap-1">
                    <PopoverButton title="Actualizar presupuesto">
                        <div className="flex items-center gap-2">
                            <p className="text-xs font-semibold">
                                Presupuesto actualizado:
                            </p>
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
                                onClick={() => {
                                    updateBudget(row.original)
                                }}
                            >
                                Actualizar
                            </Button>
                        </div>
                    </PopoverButton>
                </div>
            ),
            enableHiding: false,
            enableSorting: false,
        },
        {
            accessorKey: 'secretariesIds',
            header: 'Secretarios/as',
            enableHiding: true,
            enableSorting: false,
            cell: ({ row }) => (
                <SecretaryMultipleSelect
                    className="w-96 max-w-lg text-gray-500"
                    currentSecretaries={row.original.secretariesIds}
                    secretaries={secretaries}
                    unitId={row.id}
                />
            ),
        },
    ]

    return (
        <TanStackTable
            data={academicUnits}
            columns={columns}
            totalRecords={academicUnits.length}
            initialVisibility={{
                name: true,
                secretariesIds: true,
            }}
            searchBarPlaceholder="Buscar por nombre de categoría"
        />
    )
}
