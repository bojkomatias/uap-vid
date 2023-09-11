/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import type {
    ProtocolSectionsBudget,
    ProtocolSectionsIdentificationTeam,
} from '@prisma/client'
import { TeamMemberRelation } from '@utils/zod'
import Link from 'next/link'
import { AlertCircle, CircleCheck, FileDollar } from 'tabler-icons-react'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Group } from '@mantine/core'
import { Button } from '@elements/button'
import { protocolBudgetToAnualBudget } from '@utils/protocolBudgetToAnualBudget'
import Currency from '@elements/currency'
import InfoTooltip from '../tooltip'

type ActionButtonTypes = {
    id: string
    budgetItems: ProtocolSectionsBudget
    teamMembers: ProtocolSectionsIdentificationTeam[]
}

export default function GenerateAnualBudgetButton({
    hasBudgetCurrentYear,
    id,
    budgetItems,
    teamMembers,
}: { hasBudgetCurrentYear: boolean } & ActionButtonTypes) {
    const [opened, { open, close }] = useDisclosure(false)

    const parsedObject = TeamMemberRelation.safeParse(teamMembers)

    const formattedBudget = protocolBudgetToAnualBudget(
        id,
        budgetItems,
        teamMembers
    )

    const generateAnualBudget = async (budget: any) => {
        return await fetch(`/api/anual-budget/`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(budget),
        }).then((res) => {
            console.log(res)
        })
    }

    return (
        <>
            <Modal
                size={'auto'}
                opened={opened}
                onClose={close}
                title="Previsualización del presupuesto anual"
            >
                <section className="mb-5 max-w-[40vw]">
                    {parsedObject.success == false ? (
                        <div className="   rounded-md bg-error-400 px-6 py-2 text-sm text-white shadow">
                            <p className="mb-3 mt-2 flex items-center justify-between text-lg font-bold">
                                {parsedObject.error.issues[0].message}
                                <AlertCircle />
                            </p>
                            <p className="mb-3 leading-6">
                                Para solucionar este error, edite los miembos
                                del equipo de investigación, asegurándose de que
                                todos estén relacionados correctamente a un{' '}
                                <Link
                                    target="_blank"
                                    className="font-semibold hover:underline"
                                    href={'/team-members'}
                                >
                                    miembro previamente dado de alta
                                </Link>{' '}
                                en la plataforma.
                            </p>
                            <p className="mb-3 text-sm leading-6">
                                En caso de no existir el usuario, delo de alta
                                primeramente y luego vuelva a editar la sección
                                de equipo en el protocolo de investigación.
                            </p>
                        </div>
                    ) : (
                        <div>
                            <div className="rounded-md bg-success-300 px-6 py-3 text-sm shadow-sm">
                                <span className="flex items-center justify-between text-lg font-semibold">
                                    {' '}
                                    <p>
                                        Se generará un presupuesto para el
                                        <Link
                                            target="_blank"
                                            className="font-bold transition hover:text-gray-700"
                                            href={`/protocols/${id}`}
                                        >
                                            {' '}
                                            protocolo{' '}
                                        </Link>
                                        con los siguientes datos
                                    </p>
                                    <CircleCheck />
                                </span>
                                <p className="text-xs">
                                    Esta ventana es una previsualización, una
                                    vez generado el presupuesto, podrá ver con
                                    más detalles el presupuesto y el cálculo del
                                    monto total.
                                </p>
                            </div>
                            <div className="  my-2 rounded-md border px-6 py-2 text-sm shadow">
                                <div className="grid grid-cols-3">
                                    <div className="font-semibold text-gray-600 ">
                                        <span>Miembro de equipo</span>
                                    </div>
                                    <div className=" text-center font-semibold text-gray-600">
                                        <span>Rol</span>
                                    </div>
                                    <div className=" text-right font-semibold text-gray-600">
                                        <span>Horas asignadas</span>
                                    </div>
                                </div>
                                {parsedObject.data.map((d, idx) => (
                                    <div
                                        key={idx}
                                        className="my-2 grid grid-cols-3"
                                    >
                                        <span>{d.teamMemberId}</span>
                                        <span className="text-center">
                                            {d.role}
                                        </span>
                                        <span className="text-right">
                                            {d.hours}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="my-2 rounded-md border px-6 py-2 text-sm shadow">
                                <div className="grid grid-cols-3 ">
                                    <div className=" w-fit font-semibold text-gray-600">
                                        <span>Item</span>
                                    </div>
                                    <div className="text-center font-semibold text-gray-600">
                                        <span>Tipo</span>
                                    </div>
                                    <div className="text-right font-semibold text-gray-600">
                                        <span>Monto</span>
                                    </div>
                                </div>

                                {formattedBudget.budgetItems.map((i, idx) => (
                                    <div
                                        key={idx}
                                        className="my-2 grid grid-cols-3"
                                    >
                                        <span>{i.detail}</span>
                                        <span className="text-center">
                                            {i.type}
                                        </span>
                                        <span className="text-right">
                                            <Currency amount={i.amount} />
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
                <Button onClick={close} intent="secondary">
                    {parsedObject.success == false ? (
                        <Link href={`/protocols/${id}/0`}>
                            Editar miembos de equipo
                        </Link>
                    ) : (
                        <span
                            onClick={() => {
                                generateAnualBudget(formattedBudget)
                            }}
                        >
                            Generar presupuesto
                        </span>
                    )}
                </Button>
            </Modal>

            <Group position="center">
                <>
                    {hasBudgetCurrentYear ? (
                        <div className="relative h-fit w-fit">
                            <div className="absolute inset-0 z-[1] mr-3">
                                <InfoTooltip>
                                    <h4>
                                        El protocolo ya tiene generado un
                                        presupuesto en el corriente año.
                                    </h4>
                                </InfoTooltip>
                            </div>
                            <Button
                                intent={'secondary'}
                                disabled={hasBudgetCurrentYear}
                            >
                                <FileDollar />
                                Generar presupuesto
                                <div className="w-4" />
                            </Button>
                        </div>
                    ) : (
                        <Button intent="secondary" onClick={open}>
                            <FileDollar />
                            Generar presupuesto
                        </Button>
                    )}
                </>
            </Group>
        </>
    )
}
