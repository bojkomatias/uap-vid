/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import type {
    AnualBudget,
    AnualBudgetTeamMember,
    ProtocolSectionsBudget,
    ProtocolSectionsIdentificationTeam,
} from '@prisma/client'

import { TeamMemberRelation } from '@utils/zod'
import Link from 'next/link'
import { FileDollar } from 'tabler-icons-react'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Group } from '@mantine/core'
import { Button } from '@elements/button'
import { protocolBudgetToAnualBudget } from '@utils/protocolBudgetToAnualBudget'
import Currency from '@elements/currency'

type ActionButtonTypes = {
    id: string
    budgetItems: ProtocolSectionsBudget
    teamMembers: ProtocolSectionsIdentificationTeam[]
}

export default function GenerateAnualBudgetButton({
    id,
    budgetItems,
    teamMembers,
}: ActionButtonTypes) {
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
                <section className="mb-5 max-w-[30vw]">
                    {parsedObject.success == false ? (
                        <div className=" w-fit  rounded-md bg-error-400 p-2 text-sm text-white">
                            <p className="my-2 text-[1rem] font-bold">
                                {parsedObject.error.issues[0].message}
                            </p>
                            <p className="mb-3 leading-5">
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
                        </div>
                    ) : (
                        <div>
                            <div
                                className="rounded-md bg-success-200
                        p-2 text-sm"
                            >
                                Todo ready para generar el presupuesto rey!
                            </div>
                            <div className="my-2 w-96  rounded-md border p-2 text-sm">
                                <div className="flex  justify-between">
                                    <span>Miembo de equipo</span>
                                    <span>Horas asignadas</span>
                                </div>
                                {parsedObject.data.map((d, idx) => {
                                    return (
                                        <div
                                            key={idx}
                                            className="flex  justify-between"
                                        >
                                            <span>{d.teamMemberId}</span>
                                            <span>{d.hours}</span>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="my-2 w-96  rounded-md border p-2 text-sm">
                                <div className="flex  justify-between">
                                    <span>Item</span>
                                    <span>Monto total</span>
                                </div>
                                {formattedBudget.budgetItems.map((i, idx) => {
                                    return (
                                        <div
                                            key={idx}
                                            className="flex  justify-between"
                                        >
                                            <div>{i.detail}</div>
                                            <Currency amount={i.amount} />
                                        </div>
                                    )
                                })}
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
                <Button intent="secondary" onClick={open}>
                    <FileDollar />
                    Generar presupuesto
                </Button>
            </Group>
        </>
    )
}
