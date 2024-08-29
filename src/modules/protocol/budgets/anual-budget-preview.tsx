import type { Prisma } from '@prisma/client'
import { TeamMemberRelation } from '@utils/zod'
import { protocolToAnualBudgetPreview } from '@actions/anual-budget/action'
import { protocolDuration } from '@utils/anual-budget/protocol-duration'
import { buttonStyle } from '@elements/button/styles'
import { AlertCircle, CircleCheck } from 'tabler-icons-react'
import { ActionGenerateButton } from './action-generate'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/table'
import { Currency } from '@shared/currency'
import { Subheading } from '@components/heading'
import { DialogActions, DialogBody } from '@components/dialog'
import { Divider } from '@components/divider'

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
      <DialogBody>
        <Subheading>Miembros de equipo y horas</Subheading>
        <Table bleed dense>
          <TableHead>
            <TableRow>
              <TableHeader>Miembro</TableHeader>
              <TableHeader>Rol</TableHeader>
              <TableHeader>Categoría</TableHeader>
              <TableHeader className="text-right">Horas totales</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {budgetPreview.budgetTeamMembers.map((tmBudget, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">
                  {tmBudget.teamMember?.name}
                </TableCell>
                <TableCell>
                  {
                    parsedObject.data.find(
                      (x) => x.teamMemberId == tmBudget.teamMemberId
                    )?.role
                  }
                </TableCell>
                <TableCell className="text-zinc-500">
                  {tmBudget.teamMember?.categories.at(-1)?.category.name}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {tmBudget.hours}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Subheading className="mt-8">Gastos directos</Subheading>
        {budgetPreview.budgetItems.length !== 0 && (
          <Table bleed dense>
            <TableHead>
              <TableRow>
                <TableHeader>Detalle</TableHeader>
                <TableHeader>Tipo</TableHeader>
                <TableHeader className="text-right">Monto</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {budgetPreview.budgetItems.map((i, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{i.detail}</TableCell>
                  <TableCell>{i.type}</TableCell>
                  <TableCell className="text-right">
                    <Currency amountIndex={i.amountIndex} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogBody>
      <DialogActions>
        <ActionGenerateButton
          protocolId={protocol.id}
          anualBudgetYears={protocol.anualBudgets.map((anual) => {
            return anual.year
          })}
        />
      </DialogActions>
    </>
  )
}
