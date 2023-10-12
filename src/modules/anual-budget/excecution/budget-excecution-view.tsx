'use client'
import { useDisclosure } from '@mantine/hooks'
import { Drawer } from '@mantine/core'
import type { Execution } from '@prisma/client'
import { Button } from '@elements/button'

import Currency from '@elements/currency'
import BudgetNewExcecution from './budget-new-excecution'
import { ExcecutionType } from '@utils/anual-budget'

export default function BudgetExcecutionView({
    title,
    itemName,
    remaining,
    excecutions,
    obrero,
    positionIndex,
    anualBudgetTeamMemberId,
    excecutionType,
}: {
    title: string
    itemName: string
    remaining: number
    excecutions: Execution[]
    positionIndex: number
    excecutionType: ExcecutionType
    obrero?: { pointsObrero: number; pointPrice: number }
    anualBudgetTeamMemberId?: string
}) {
    const [opened, { open, close }] = useDisclosure(false)

    return (
        <>
            <Drawer
                className="absolute "
                position="right"
                opened={opened}
                onClose={close}
            >
                <section
                    className="flex flex-col gap-4"
                    onClick={(e) => e.preventDefault()}
                >
                    <div className="flex flex-col gap-3 rounded-md bg-gray-50 p-6 shadow-md">
                        <h1 className="text-xl font-semibold">
                            {excecutionType === ExcecutionType.TeamMember
                                ? 'Honorario de equipo'
                                : 'Gasto Directo'}
                        </h1>
                        <div className="flex  items-center gap-1">
                            <p className="text-sm font-semibold text-gray-600">
                                {excecutionType === ExcecutionType.TeamMember
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
                    <div className="flex flex-col gap-3 rounded-md bg-gray-50 p-6 shadow-md">
                        {remaining > 0 ? (
                            <>
                                <p className="text-md font-semibold text-gray-600">
                                    Nueva Ejecución:
                                </p>
                                <BudgetNewExcecution
                                    maxAmount={remaining}
                                    anualBudgetTeamMemmberId={
                                        anualBudgetTeamMemberId
                                    }
                                    excecutionType={excecutionType}
                                    budgetItemPositionIndex={positionIndex}
                                />
                            </>
                        ) : null}
                        {excecutions.length > 0 ? (
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
                                        {excecutions
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
            </Drawer>

            <Button
                className="float-right px-2 py-0.5 text-xs"
                onClick={open}
                intent="secondary"
            >
                Ver
            </Button>
        </>
    )
}
