'use client'

import type { Execution } from '@prisma/client'
import { Button } from '@elements/button'

import Currency from '@elements/currency'
import BudgetNewExecution from './budget-new-excecution'
import { ExecutionType } from '@utils/anual-budget'
import { useState } from 'react'
import CustomDrawer from '@elements/custom-drawer'

export default function BudgetExecutionView({
    title,
    itemName,
    remaining,
    executions,
    obrero,
    positionIndex,
    anualBudgetTeamMemberId,
    executionType,
}: {
    title: string
    itemName: string
    remaining: number
    executions: Execution[]
    positionIndex: number
    executionType: ExecutionType
    obrero?: { pointsObrero: number; pointPrice: number }
    anualBudgetTeamMemberId?: string
}) {
    const [opened, setOpened] = useState(false)

    return (
        <>
            <CustomDrawer title="Ejecuciones" open={opened} onClose={close}>
                <section
                    className="flex flex-col gap-4"
                    onClick={(e) => e.preventDefault()}
                >
                    <div className="flex flex-col gap-3 rounded-md bg-gray-50 px-4 py-3">
                        <h1 className="text-xl font-semibold">
                            {executionType === ExecutionType.TeamMember
                                ? 'Honorario de equipo'
                                : 'Gasto Directo'}
                        </h1>
                        <div className="flex  items-center gap-1">
                            <p className="text-sm font-semibold text-gray-600">
                                {executionType === ExecutionType.TeamMember
                                    ? 'Nombre y Apellido:'
                                    : 'Detalle:'}
                            </p>
                            <p className="text-sm">{title}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-gray-600">
                                Categoría:
                            </p>
                            <p className="text-sm">
                                {obrero ? 'Obrero' : itemName}
                            </p>
                        </div>
                        {obrero && (
                            <div className="flex flex-col items-start gap-2">
                                <p className="text-sm font-semibold text-gray-600">
                                    Puntos: {obrero.pointsObrero}
                                </p>
                                <p className="text-sm font-semibold text-gray-600">
                                    Precio Punto: ${obrero.pointPrice}
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-3 rounded-md bg-gray-50 px-4 py-3">
                        {remaining > 0 ? (
                            <>
                                <p className="text-md font-semibold text-gray-600">
                                    Nueva Ejecución:
                                </p>
                                <BudgetNewExecution
                                    maxAmount={remaining}
                                    anualBudgetTeamMemberId={
                                        anualBudgetTeamMemberId
                                    }
                                    executionType={executionType}
                                    budgetItemPositionIndex={positionIndex}
                                />
                            </>
                        ) : null}
                        {executions.length > 0 ? (
                            <>
                                <p className="text-sm text-gray-600">
                                    Ejecuciones históricas:
                                </p>
                                <table className="table-auto text-sm text-gray-600">
                                    <thead>
                                        <tr className="text-left ">
                                            <th className="font-semibold">
                                                Monto
                                            </th>
                                            <th className="font-semibold">
                                                Fecha
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {executions
                                            .reverse()
                                            .map((execution, idx) => {
                                                return (
                                                    <>
                                                        <tr key={idx}>
                                                            <td className="pt-2">
                                                                <Currency
                                                                    amount={
                                                                        execution.amount
                                                                    }
                                                                />
                                                            </td>
                                                            <td>
                                                                {execution.date.toLocaleDateString()}
                                                            </td>
                                                        </tr>
                                                    </>
                                                )
                                            })}
                                    </tbody>
                                </table>
                            </>
                        ) : (
                            <p className="mt-6 text-center text-sm text-gray-600">
                                <b>No hay ejecuciones históricas</b>
                            </p>
                        )}
                    </div>
                </section>
            </CustomDrawer>

            <Button
                className="float-right px-2 py-0.5 text-xs"
                onClick={() => {
                    setOpened(true)
                }}
                intent="secondary"
            >
                Ver
            </Button>
        </>
    )
}
