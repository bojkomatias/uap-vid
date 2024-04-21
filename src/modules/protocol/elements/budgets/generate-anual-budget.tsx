import { TeamMemberRelation } from '@utils/zod'
import Link from 'next/link'
import { AlertCircle, CircleCheck } from 'tabler-icons-react'
import Currency from '@elements/currency'
import { protocolToAnualBudgetPreview } from '@actions/anual-budget/action'
import { findProtocolByIdWithResearcher } from '@repositories/protocol'
import { buttonStyle } from '@elements/button/styles'
import { ActionGenerateButton } from './action-generate'
import { protocolDuration } from '@utils/anual-budget/protocol-duration'

export async function GenerateAnualBudget({
    protocolId,
}: {
    protocolId: string
}) {
    const protocol = await findProtocolByIdWithResearcher(protocolId)
    if (!protocol) return
    const parsedObject = TeamMemberRelation.safeParse(
        protocol.sections.identification.team
    )

    if (!parsedObject.success)
        return (
            <div>
                <section className="mb-5">
                    <h1 className="text-lg font-semibold leading-7 text-gray-900">
                        Previsualización del presupuesto anual
                    </h1>
                    <div className="rounded-md bg-error-400 px-6 py-2 text-sm text-white shadow">
                        <p className="mb-3 mt-2 flex items-center justify-between text-lg font-bold">
                            {parsedObject.error.issues[0].message}
                            <AlertCircle />
                        </p>
                        <p className="mb-3 leading-6">
                            Para solucionar este error, edite los miembros del
                            equipo de investigación, asegurándose de que todos
                            estén relacionados correctamente a un{' '}
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
                            primeramente y luego vuelva a editar la sección de
                            equipo en el protocolo de investigación.
                        </p>
                    </div>
                </section>
                <Link
                    scroll={false}
                    href={`/protocols/${protocolId}/0`}
                    className={buttonStyle('secondary')}
                >
                    Editar miembros de equipo
                </Link>
            </div>
        )

    const budgetPreview = await protocolToAnualBudgetPreview(
        protocolId,
        protocol.sections.budget,
        protocol.sections.identification.team,
        protocolDuration(protocol.sections.duration.duration)
    )

    return (
        <div>
            <section className="mb-5">
                <h1 className="text-lg font-semibold leading-7 text-gray-900">
                    Previsualización del presupuesto anual
                </h1>
                <div>
                    <div className="rounded-md bg-success-300 px-6 py-3 text-sm shadow-sm">
                        <span className="flex items-center justify-between text-lg font-semibold">
                            {' '}
                            <p>
                                Se generará un presupuesto para el
                                <Link
                                    target="_blank"
                                    className="font-bold transition hover:text-gray-700"
                                    href={`/protocols/${protocolId}`}
                                >
                                    {' '}
                                    protocolo{' '}
                                </Link>
                                con los siguientes datos
                            </p>
                            <CircleCheck />
                        </span>
                        <p className="text-xs">
                            Esta ventana es una previsualización, una vez
                            generado el presupuesto, podrá ver con más detalles
                            el presupuesto y el cálculo del monto total.
                        </p>
                    </div>
                    <div className="  my-2 rounded-md border px-6 py-2 text-sm shadow">
                        <div className="grid grid-cols-4">
                            <div className="font-semibold text-gray-600 ">
                                <span>Miembro de equipo</span>
                            </div>
                            <div className=" text-center font-semibold text-gray-600">
                                <span>Rol</span>
                            </div>
                            <div className=" text-center font-semibold text-gray-600">
                                <span>Categoría</span>
                            </div>
                            <div className=" text-right font-semibold text-gray-600">
                                <span>Total horas</span>
                            </div>
                        </div>
                        {budgetPreview.budgetTeamMembers.map(
                            (teamMemberBudget, idx) => (
                                <div
                                    key={idx}
                                    className="my-2 grid grid-cols-4"
                                >
                                    <span>
                                        {teamMemberBudget.teamMember?.name}
                                    </span>
                                    <span className="text-center">
                                        {
                                            parsedObject.data.find(
                                                (x) =>
                                                    x.teamMemberId ==
                                                    teamMemberBudget.teamMemberId
                                            )?.role
                                        }
                                    </span>
                                    <span className="text-center">
                                        {
                                            teamMemberBudget.teamMember.categories.at(
                                                -1
                                            )?.category.name
                                        }
                                    </span>
                                    <span className="text-right">
                                        {teamMemberBudget.hours}
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                    {budgetPreview.budgetItems.length !== 0 && (
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
                    )}
                </div>
            </section>

            <ActionGenerateButton
                protocolId={protocolId}
                anualBudgetYears={protocol.anualBudgets.map((anual) => {
                    return anual.year
                })}
            />
        </div>
    )
}
