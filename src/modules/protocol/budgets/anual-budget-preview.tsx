import type { Prisma } from '@prisma/client'
import { TeamMemberRelation } from '@utils/zod'
import { protocolToAnualBudgetPreview } from '@actions/anual-budget/action'
import { protocolDuration } from '@utils/anual-budget/protocol-duration'
import { buttonStyle } from '@elements/button/styles'
import { AlertCircle, CircleCheck } from 'tabler-icons-react'
import { ActionGenerateButton } from './action-generate'
import Link from 'next/link'

export async function AnualBudgetPreview({
  protocol,
}: {
  protocol: Prisma.ProtocolGetPayload<{
    include: {
      researcher: { select: { id: true; name: true; email: true } }
      convocatory: { select: { id: true; name: true } }
      anualBudgets: {
        select: { createdAt: true; year: true; id: true }
      }
    }
  }>
}) {
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
          <div className="rounded-md bg-red-400 px-6 py-2 text-sm text-white shadow">
            <p className="mb-3 mt-2 flex items-center justify-between text-lg font-bold">
              {parsedObject.error.issues[0].message}
              <AlertCircle />
            </p>
            <p className="mb-3 leading-6">
              Para solucionar este error, edite los miembros del equipo de
              investigación, asegurándose de que todos estén relacionados
              correctamente a un{' '}
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
              En caso de no existir el usuario, delo de alta primeramente y
              luego vuelva a editar la sección de equipo en el protocolo de
              investigación.
            </p>
          </div>
        </section>
        <Link
          scroll={false}
          href={`/protocols/${protocol.id}/0`}
          className={buttonStyle('secondary')}
        >
          Editar miembros de equipo
        </Link>
      </div>
    )

  const budgetPreview = await protocolToAnualBudgetPreview(
    protocol.id,
    protocol.sections.budget,
    protocol.sections.identification.team,
    protocolDuration(protocol.sections.duration.duration)
  )
  return (
    <>
      <section className="mb-5">
        <h1 className="text-lg font-semibold leading-7 text-gray-900">
          Previsualización del presupuesto anual
        </h1>
        <div>
          <div className="rounded-md bg-teal-300 px-6 py-3 text-sm shadow-sm">
            <span className="flex items-center justify-between text-lg font-semibold">
              <p>
                Se generará un presupuesto para el
                <Link
                  target="_blank"
                  className="font-bold transition hover:text-gray-700"
                  href={`/protocols/${protocol.id}`}
                >
                  {' '}
                  protocolo{' '}
                </Link>
                con los siguientes datos
              </p>
              <CircleCheck />
            </span>
            <p className="text-xs">
              Esta ventana es una previsualización, una vez generado el
              presupuesto, podrá ver con más detalles el presupuesto y el
              cálculo del monto total.
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
            {budgetPreview.budgetTeamMembers.map((teamMemberBudget, idx) => (
              <div key={idx} className="my-2 grid grid-cols-4">
                <span>{teamMemberBudget.teamMember?.name}</span>
                <span className="text-center">
                  {
                    parsedObject.data.find(
                      (x) => x.teamMemberId == teamMemberBudget.teamMemberId
                    )?.role
                  }
                </span>
                <span className="text-center">
                  {
                    teamMemberBudget.teamMember?.categories.at(-1)?.category
                      .name
                  }
                </span>
                <span className="text-right">{teamMemberBudget.hours}</span>
              </div>
            ))}
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
                <div key={idx} className="my-2 grid grid-cols-3">
                  <span>{i.detail}</span>
                  <span className="text-center">{i.type}</span>
                  <span className="text-right">
                    {/* To be INDEXED WHEN FINISHED! */}
                    {/* <Currency amountIndex={i.amountIndex} /> */}
                    Preview to be indexed
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <ActionGenerateButton
        protocolId={protocol.id}
        anualBudgetYears={protocol.anualBudgets.map((anual) => {
          return anual.year
        })}
      />
    </>
  )
}
