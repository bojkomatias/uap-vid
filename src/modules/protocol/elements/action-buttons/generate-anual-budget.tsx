'use client'
import type {
    AnualBudgetItem,
    ProtocolSectionsIdentificationTeam,
} from '@prisma/client'
import { TeamMemberRelation } from '@utils/zod'
import Link from 'next/link'
import { AlertCircle, CircleCheck, FileDollar } from 'tabler-icons-react'
import { Button } from '@elements/button'
import Currency from '@elements/currency'
import InfoTooltip from '../tooltip'
import { generateAnualBudget } from '@actions/anual-budget/action'
import { useRouter } from 'next/navigation'
import type { AnualBudgetTeamMemberWithAllRelations } from '@utils/anual-budget'
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { notifications } from '@elements/notifications'

type ActionButtonTypes = {
    hasBudgetCurrentYear: boolean
    budgetPreview: {
        year: string
        protocolId: string
        budgetItems: AnualBudgetItem[]
        budgetTeamMembers: Omit<AnualBudgetTeamMemberWithAllRelations, 'id'>[]
    }
    teamMembers: ProtocolSectionsIdentificationTeam[]
}

export default function GenerateAnualBudgetButton({
    hasBudgetCurrentYear,
    budgetPreview,
    teamMembers,
}: ActionButtonTypes) {
    const [open, setOpen] = useState(false)
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
                        setOpen(false)
                    }}
                >
                    Editar miembros de equipo
                </Button>
            )
        } else {
            return (
                <Button
                    intent="secondary"
                    onClick={async () => {
                        notifications.show({
                            title: 'Presupuesto generado',
                            message: 'Se generó correctamente el presupuesto',
                            intent: 'success',
                        })
                        const budget = await generateAnualBudget(
                            budgetPreview.protocolId,
                            currentYear
                        )

                        //Adding this for improved UX.
                        setTimeout(() => {
                            budget
                                ? notifications.show({
                                      title: 'Presupuesto generado',
                                      message:
                                          'Se generó correctamente el presupuesto',
                                      intent: 'success',
                                  })
                                : notifications.show({
                                      title: 'Problema al generar presupuesto',
                                      message:
                                          'Ocurrió un error al generar el presupuesto',
                                      intent: 'error',
                                  })

                            setOpen(false)
                        }, 500)
                    }}
                >
                    Generar presupuesto
                </Button>
            )
        }
    }

    return (
        <>
            <Transition appear show={open} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={setOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/30" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title className="mb-4 font-semibold">
                                        Previsualización del presupuesto anual
                                    </Dialog.Title>
                                    <section className="mb-5">
                                        {parsedObject.success == false ? (
                                            <div className="rounded-md bg-error-400 px-6 py-2 text-sm text-white shadow">
                                                <p className="mb-3 mt-2 flex items-center justify-between text-lg font-bold">
                                                    {
                                                        parsedObject.error
                                                            .issues[0].message
                                                    }
                                                    <AlertCircle />
                                                </p>
                                                <p className="mb-3 leading-6">
                                                    Para solucionar este error,
                                                    edite los miembros del
                                                    equipo de investigación,
                                                    asegurándose de que todos
                                                    estén relacionados
                                                    correctamente a un{' '}
                                                    <Link
                                                        target="_blank"
                                                        className="font-semibold hover:underline"
                                                        href={'/team-members'}
                                                    >
                                                        miembro previamente dado
                                                        de alta
                                                    </Link>{' '}
                                                    en la plataforma.
                                                </p>
                                                <p className="mb-3 text-sm leading-6">
                                                    En caso de no existir el
                                                    usuario, delo de alta
                                                    primeramente y luego vuelva
                                                    a editar la sección de
                                                    equipo en el protocolo de
                                                    investigación.
                                                </p>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="rounded-md bg-success-300 px-6 py-3 text-sm shadow-sm">
                                                    <span className="flex items-center justify-between text-lg font-semibold">
                                                        {' '}
                                                        <p>
                                                            Se generará un
                                                            presupuesto para el
                                                            <Link
                                                                target="_blank"
                                                                className="font-bold transition hover:text-gray-700"
                                                                href={`/protocols/${budgetPreview.protocolId}`}
                                                            >
                                                                {' '}
                                                                protocolo{' '}
                                                            </Link>
                                                            con los siguientes
                                                            datos
                                                        </p>
                                                        <CircleCheck />
                                                    </span>
                                                    <p className="text-xs">
                                                        Esta ventana es una
                                                        previsualización, una
                                                        vez generado el
                                                        presupuesto, podrá ver
                                                        con más detalles el
                                                        presupuesto y el cálculo
                                                        del monto total.
                                                    </p>
                                                </div>
                                                <div className="  my-2 rounded-md border px-6 py-2 text-sm shadow">
                                                    <div className="grid grid-cols-3">
                                                        <div className="font-semibold text-gray-600 ">
                                                            <span>
                                                                Miembro de
                                                                equipo
                                                            </span>
                                                        </div>
                                                        <div className=" text-center font-semibold text-gray-600">
                                                            <span>Rol</span>
                                                        </div>
                                                        <div className=" text-right font-semibold text-gray-600">
                                                            <span>
                                                                Horas asignadas
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {budgetPreview.budgetTeamMembers.map(
                                                        (
                                                            teamMemberBudget,
                                                            idx
                                                        ) => (
                                                            <div
                                                                key={idx}
                                                                className="my-2 grid grid-cols-3"
                                                            >
                                                                <span>
                                                                    {
                                                                        teamMemberBudget
                                                                            .teamMember
                                                                            ?.name
                                                                    }
                                                                </span>
                                                                <span className="text-center">
                                                                    {
                                                                        parsedObject.data.find(
                                                                            (
                                                                                x
                                                                            ) =>
                                                                                x.teamMemberId ==
                                                                                teamMemberBudget.teamMemberId
                                                                        )?.role //This is the only thing that I didn't like and add it to the preview will generate type conflict and inconsistencies
                                                                    }
                                                                </span>
                                                                <span className="text-right">
                                                                    {
                                                                        teamMemberBudget.hours
                                                                    }
                                                                </span>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                                {budgetPreview.budgetItems
                                                    .length !== 0 && (
                                                    <div className="my-2 rounded-md border px-6 py-2 text-sm shadow">
                                                        <div className="grid grid-cols-3 ">
                                                            <div className=" w-fit font-semibold text-gray-600">
                                                                <span>
                                                                    Item
                                                                </span>
                                                            </div>
                                                            <div className="text-center font-semibold text-gray-600">
                                                                <span>
                                                                    Tipo
                                                                </span>
                                                            </div>
                                                            <div className="text-right font-semibold text-gray-600">
                                                                <span>
                                                                    Monto
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {budgetPreview.budgetItems.map(
                                                            (i, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="my-2 grid grid-cols-3"
                                                                >
                                                                    <span>
                                                                        {
                                                                            i.detail
                                                                        }
                                                                    </span>
                                                                    <span className="text-center">
                                                                        {i.type}
                                                                    </span>
                                                                    <span className="text-right">
                                                                        <Currency
                                                                            amount={
                                                                                i.amount
                                                                            }
                                                                        />
                                                                    </span>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </section>
                                    {actionButton()}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {hasBudgetCurrentYear ? (
                <div className="relative w-fit">
                    <div className="absolute inset-0 z-[10] mr-3">
                        <InfoTooltip>
                            <h4>
                                El protocolo ya tiene generado un presupuesto en
                                el corriente año.
                            </h4>
                        </InfoTooltip>
                    </div>
                    <Button
                        className="h-10"
                        intent={'secondary'}
                        disabled={hasBudgetCurrentYear}
                    >
                        <FileDollar className="h-4 w-4 text-current" />
                        Generar presupuesto
                        <div className="w-4" />
                    </Button>
                </div>
            ) : (
                <Button
                    className="h-10"
                    intent="secondary"
                    onClick={() => setOpen(true)}
                >
                    <FileDollar className="h-4 w-4 text-current" />
                    Generar presupuesto
                </Button>
            )}
        </>
    )
}
