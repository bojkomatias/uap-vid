'use client'

import type { AcademicUnitBudget } from '@prisma/client'
import { type AcademicUnit, type User } from '@prisma/client'
import type { ColumnDef } from '@tanstack/react-table'
import TanStackTable from '@shared/data-table/tan-stack-table'
import { Currency } from '@shared/currency'
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from '@components/dropdown'
import { Dots } from 'tabler-icons-react'
import { EditAcademicUnitFormDialog } from './edit-academic-unit-form-dialog'
import { useState } from 'react'
import { UpdateAcademicUnitBudgetDialog } from './update-academic-unit-budget-dialog'

export default function AcademicUnitsTable({
  academicUnits,
  totalRecords,
}: {
  academicUnits: AcademicUnit[]
  totalRecords: number
}) {
  // Controls the Academic Unit modal
  const [currentAcademicUnit, setCurrentAcademicUnit] = useState<
    AcademicUnit | undefined
  >()

  // Controls budget modal
  const [currenctAcademicUnitBudgets, setCurrentAcademicUnitBudgets] = useState<
    | {
        academicUnitId: string
        academicUnitBudgets: AcademicUnitBudget[]
      }
    | undefined
  >(undefined)

  const columns: ColumnDef<AcademicUnit>[] = [
    {
      accessorKey: 'name',
      header: 'Unidad Académica',
      enableHiding: true,
      enableSorting: true,
    },
    {
      accessorKey: 'shortname',
      header: 'Nombre corto',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.shortname}</span>
      ),
      enableHiding: true,
      enableSorting: true,
    },
    {
      accessorKey: 'budgets',
      header: 'Presupuesto',
      enableHiding: false,
      enableSorting: false,
      cell: ({ row }) => (
        <>
          {row.original.budgets.length > 0 ?
            <Currency amountIndex={row.original.budgets.at(-1)!.amountIndex} />
          : null}
        </>
      ),
    },
    {
      accessorKey: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="-mx-3 -my-1.5 sm:-mx-2.5">
          <Dropdown>
            <DropdownButton plain>
              <Dots data-slot="icon" />
            </DropdownButton>
            <DropdownMenu anchor="bottom end">
              <DropdownItem
                onClick={() => {
                  setCurrentAcademicUnit(row.original)
                }}
              >
                Editar
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  setCurrentAcademicUnitBudgets({
                    academicUnitId: row.original.id,
                    academicUnitBudgets: row.original.budgets.reverse(),
                  })
                }}
              >
                Actualizar presupuesto
              </DropdownItem>
              <DropdownItem href={`/academic-units/edit/${row.original.id}`}>
                Asignar secretarios
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      ),
      enableHiding: false,
      enableSorting: false,
    },
  ]

  return (
    <>
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
      <EditAcademicUnitFormDialog
        academicUnit={currentAcademicUnit}
        onClose={() => setCurrentAcademicUnit(undefined)}
      />
      <UpdateAcademicUnitBudgetDialog
        {...currenctAcademicUnitBudgets}
        onClose={() => setCurrentAcademicUnitBudgets(undefined)}
      />
    </>
  )
}
