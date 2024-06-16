'use client'

import type { AcademicUnit, User } from '@prisma/client'
import { Badge } from '@elements/badge'
import Currency from '@elements/currency'
import { SecretaryMultipleSelect } from './secretary-multiple-select'
import { AcademicUnitBudgetUpdate } from './academic-unit-budget-update'
import CustomDrawer from '@elements/custom-drawer'
import { useState } from 'react'
import { BadgeButton } from '@components/badge'

export default function AcademicUnitView({
  academicUnit,
  secretaries,
}: {
  academicUnit: AcademicUnit
  secretaries: User[]
}) {
  const [opened, setOpened] = useState(false)

  return (
    <>
      <CustomDrawer title="Unidad Académica" open={opened} onClose={setOpened}>
        <section
          className="flex flex-col gap-4"
          onClick={(e) => e.preventDefault()}
        >
          <div className="flex flex-col gap-3 rounded-md bg-gray-50 px-4 py-3">
            <div className="flex  items-center gap-1">
              <Badge className="text-sm">{academicUnit.name}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600">Presupuesto:</p>
              <Currency
                amount={
                  academicUnit.budgets[academicUnit.budgets.length - 1]?.amount
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-md bg-gray-50 px-4 py-3">
            <p className="text-sm text-gray-600">Editar secretarios/as</p>
            <SecretaryMultipleSelect
              className=" max-w-lg text-gray-500"
              currentSecretaries={academicUnit.secretariesIds}
              secretaries={secretaries}
              unitId={academicUnit.id}
            />
            <p className="text-sm text-gray-600">Actualizar presupuesto:</p>
            <AcademicUnitBudgetUpdate
              academicUnitId={academicUnit.id}
              ACBudgets={academicUnit.budgets}
            />

            <p className="text-sm text-gray-600">Presupuestos históricos:</p>
            <table className="table-auto text-sm text-gray-600">
              <thead>
                <tr className="text-left ">
                  <th className="font-semibold">Presupuesto</th>
                  <th className="font-semibold">Desde</th>
                  <th className="font-semibold">Hasta</th>
                </tr>
              </thead>
              <tbody>
                {academicUnit.budgets
                  .slice(0, academicUnit.budgets.length - 1)
                  .reverse()
                  .map((budget, idx) => {
                    return (
                      <>
                        <tr key={idx}>
                          <td className="pt-2">
                            <Currency amount={budget.amount} />
                          </td>
                          <td>{budget.from.toLocaleDateString()}</td>
                          <td>{budget.to?.toLocaleDateString()}</td>
                        </tr>
                      </>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </section>
      </CustomDrawer>
      <BadgeButton
        onClick={() => {
          setOpened(true)
        }}
        color="teal"
      >
        Editar
      </BadgeButton>
    </>
  )
}
