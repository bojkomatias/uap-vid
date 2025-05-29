import type { Prisma } from '@prisma/client'
import { TeamMemberRelation } from '@utils/zod'
import { protocolToAnualBudgetPreview } from '@actions/anual-budget/action'
<<<<<<< HEAD
import { protocolDuration } from '@utils/constants'
=======
import { protocolDuration } from '@utils/anual-budget/protocol-duration'
>>>>>>> origin/develop
import { ActionGenerateButton } from './action-generate'
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
import { z } from 'zod'

export async function AnualBudgetPreview({
  protocol,
  parsedData,
}: {
  protocol: Prisma.ProtocolGetPayload<{
    include: {
      researcher: { select: { id: true; name: true; email: true } }
      convocatory: { select: { id: true; name: true } }
      anualBudgets: {
        select: { createdAt: true; year: true; id: true; state: true }
      }
    }
  }>
  parsedData: z.infer<typeof TeamMemberRelation>
}) {
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
              <TableRow key={idx + tmBudget.hours}>
                <TableCell className="font-medium">
                  {tmBudget.teamMember?.name}
                </TableCell>
                <TableCell>
                  {
                    parsedData.find(
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

        {budgetPreview.budgetItems.length !== 0 && (
          <>
            <Subheading className="mt-8">Gastos directos</Subheading>
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
                  <TableRow key={idx + i.type}>
                    <TableCell className="font-medium">{i.detail}</TableCell>
                    <TableCell>{i.type}</TableCell>
                    <TableCell className="text-right">
                      <Currency amountIndex={i.amountIndex} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </DialogBody>
      <DialogActions>
        <ActionGenerateButton
          protocolId={protocol.id}
          anualBudgets={protocol.anualBudgets}
        />
      </DialogActions>
    </>
  )
}
