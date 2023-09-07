'use client'
import { buttonStyle } from '@elements/button/styles'
import type {
    ProtocolSectionsBudget,
    ProtocolSectionsIdentificationTeam,
    Review,
    User,
} from '@prisma/client'

import { TeamMemberRelation } from '@utils/zod'
import Link from 'next/link'
import { FileDollar } from 'tabler-icons-react'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Group } from '@mantine/core'
import { Button } from '@elements/button'

type ActionButtonTypes = {
    id: string
    budgetItems: ProtocolSectionsBudget
    teamMembers: ProtocolSectionsIdentificationTeam[]
    reviews: Review[]
}

export default function GenerateAnualBudgetButton({
    id,
    budgetItems,
    teamMembers,
    reviews,
}: ActionButtonTypes) {
    const [opened, { open, close }] = useDisclosure(false)

    const parsedObject = TeamMemberRelation.safeParse(teamMembers)

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
                                {budgetItems['expenses'].map((d, idx) => {
                                    return (
                                        <div
                                            key={idx}
                                            className="flex  justify-between"
                                        >
                                            <span>Item del budget</span>
                                            <span>$20.000,00</span>
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
                        'Generar presupuesto'
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
