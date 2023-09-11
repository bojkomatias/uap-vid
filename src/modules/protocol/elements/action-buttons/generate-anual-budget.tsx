'use client'
import type {
    AnualBudgetItem,
    AnualBudgetTeamMember,
    ProtocolSectionsIdentificationTeam,
    TeamMember,
} from '@prisma/client'
import { TeamMemberRelation } from '@utils/zod'
import Link from 'next/link'
import { AlertCircle, CircleCheck, FileDollar } from 'tabler-icons-react'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Group } from '@mantine/core'
import { Button } from '@elements/button'
import Currency from '@elements/currency'
import { generateAnualBudget } from '@actions/anual-budget/action'
import { useRouter } from 'next/navigation'
import type { AnualBudgetTeamMemberWithAllRelations } from '@utils/anual-budget'

type ActionButtonTypes = {
    budgetPreview: {
        year: string
        protocolId: string
        budgetItems: AnualBudgetItem[]
        budgetTeamMembers: Omit<AnualBudgetTeamMemberWithAllRelations, 'id'>[]
    }
    teamMembers: ProtocolSectionsIdentificationTeam[]
}

export default async function GenerateAnualBudgetButton({
    budgetPreview,
    teamMembers,
}: ActionButtonTypes) {
    const [opened, { open, close }] = useDisclosure(false)
    const router = useRouter()
    const parsedObject = TeamMemberRelation.safeParse(teamMembers)
    const currentYear = new Date().getFullYear().toString()

    const actionButton = () => {
        if (parsedObject.success == false) {
            return (
                <Button
                    intent="secondary"
                    onClick={() => {
                        router.push(`/protocols/${budgetPreview.protocolId}/0`)
                    }}
                >
                    Editar miembos de equipo
                </Button>
            )
        } else {
            return (
                <Button
                    intent="secondary"
                    onClick={() => {
                        generateAnualBudget(protocolId, currentYear)
                        close()
                    }}
                >
                    Generar presupuesto
                </Button>
            )
        }
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
                                            href={`/protocols/${budgetPreview.protocolId}`}
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
                                {budgetPreview.budgetTeamMembers.map(
                                    (teamMemberBudget, idx) => (
                                        <div
                                            key={idx}
                                            className="my-2 grid grid-cols-3"
                                        >
                                            <span>
                                                {
                                                    teamMemberBudget.teamMember
                                                        ?.name
                                                }
                                            </span>
                                            <span className="text-center">
                                                {
                                                    parsedObject.data.find(
                                                        (x) =>
                                                            x.teamMemberId ==
                                                            teamMemberBudget.teamMemberId
                                                    )?.role //This is the only thing that I didn't like and add it to the preview will generate type conflict and inconsistencies
                                                }
                                            </span>
                                            <span className="text-right">
                                                {teamMemberBudget.hours}
                                            </span>
                                        </div>
                                    )
                                )}
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

                                {budgetPreview.budgetItems.map((i, idx) => (
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
                {actionButton()}
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
