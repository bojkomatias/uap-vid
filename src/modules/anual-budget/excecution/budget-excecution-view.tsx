'use client'
import { useDisclosure } from '@mantine/hooks'
import { Drawer } from '@mantine/core'
import type { Execution } from '@prisma/client'
import { Button } from '@elements/button'
import { Badge } from '@elements/badge'

import Currency from '@elements/currency'
import BudgetNewExcecution from './budget-new-excecution'
import { ExcecutionType } from '@utils/anual-budget'

export default function BudgetExcecutionView({
    title,
    itemName,
    excecutions,
    obrero,
    positionIndex,
    anualBudgetTeamMemberId,
    excecutionType,
}: {
    title: string
    itemName: string
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
                        <div className="flex  items-center gap-1">
                            <Badge className="text-sm">{title}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            {excecutionType === ExcecutionType.TeamMember ? (
                                <p className="text-sm text-gray-600">
                                    <b>Categoría: </b>
                                </p>
                            ) : null}
                            <p className="text-sm">
                                {obrero ? 'Obrero' : itemName}
                            </p>
                        </div>
                        {obrero && (
                            <div className="flex flex-col items-start gap-2">
                                <p className="text-sm text-gray-600">
                                    <b>Puntos:</b> {obrero.pointsObrero}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <b>Precio Punto:</b> ${obrero.pointPrice}
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-3 rounded-md bg-gray-50 p-6 shadow-md">
                        <p className="text-sm text-gray-600">
                            Nueva Ejecución:
                        </p>
                        <BudgetNewExcecution
                            anualBudgetTeamMemmberId={anualBudgetTeamMemberId}
                            excecutionType={excecutionType}
                            budgetItemPositionIndex={positionIndex}
                        />
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
                            <p className="mt-6 text-sm text-gray-600">
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
