'use client'
import type { Prisma } from '@prisma/client'
import {
  calculateHourRateGivenTMCategory,
  calculateTotalBudget,
} from '@utils/anual-budget'
import { Currency } from '@shared/currency'
import { multiplyAmountIndex, sumAmountIndex } from '@utils/amountIndex'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@components/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/table'
import { Subheading } from '@components/heading'
import { Button } from '@components/button'
import { Badge } from '@components/badge'

type Budget = Prisma.AnualBudgetGetPayload<{
  include: {
    protocol: {
      select: {
        state: true
        sections: {
          select: {
            identification: {
              select: { title: true; sponsor: true; team: true }
            }
            duration: { select: { duration: true } }
          }
        }
      }
    }
    budgetItems: {
      include: {
        executions: {
          include: {
            academicUnit: true
          }
          orderBy: {
            date: 'desc'
          }
        }
      }
      orderBy: {
        createdAt: 'asc'
      }
    }
    budgetTeamMembers: {
      include: {
        teamMember: {
          include: {
            categories: {
              select: { category: true; amountIndex: true; pointsObrero: true }
              include: { category: true }
            }
          }
        }
        category: true
        executions: {
          include: {
            academicUnit: true
          }
          orderBy: {
            date: 'desc'
          }
        }
      }
    }
    AcademicUnits: true
  }
}>

export async function BudgetProtocolView({ budget }: { budget: Budget }) {
  const router = useRouter()

  const { budgetItems, budgetTeamMembers, protocol } = budget

  const calculations = calculateTotalBudget(budget)

  // Helper function to find the deactivation date for a team member
  const findDeactivationDate = (teamMemberId: string | null): Date | null => {
    if (!teamMemberId || !protocol.sections.identification.team) return null

    const protocolMember = protocol.sections.identification.team.find(
      (pm) => pm.teamMemberId === teamMemberId
    )

    if (!protocolMember?.assignments) return null

    // Find assignment with 'to' date (deactivated assignment)
    const deactivatedAssignment = protocolMember.assignments.find((a) => a.to)
    return deactivatedAssignment?.to || null
  }

  return (
    // Cannot delay router back for animation transition because it bugs out.
    <Dialog transition open={true} onClose={() => router.back()} size="4xl">
      <DialogTitle>Presupuesto {budget.year}</DialogTitle>
      <DialogDescription>
        Honorarios y gastos directos presupuestados
      </DialogDescription>
      <DialogBody>
        <Subheading>Honorarios del equipo</Subheading>

        <Table bleed dense>
          <colgroup>
            <col className="w-1/5" />
            <col className="w-1/5" />
            <col className="w-1/5" />
            <col className="w-1/5" />
            <col className="w-1/5" />
          </colgroup>
          <TableHead>
            <TableRow>
              <TableHeader colSpan={2}>Miembro</TableHeader>
              <TableHeader>Horas</TableHeader>
              <TableHeader>Valor</TableHeader>
              <TableHeader>Total</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {budgetTeamMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell colSpan={2} className="font-medium">
                  <div className="flex flex-col gap-1">
                    <div>
                      {member.teamMember ?
                        member.teamMember.name
                      : member.category?.name}
                    </div>
                    {(() => {
                      const deactivationDate = findDeactivationDate(
                        member.teamMemberId
                      )
                      return deactivationDate ?
                          <Badge color="red" className="w-fit text-xs">
                            Finalizado:{' '}
                            {deactivationDate.toLocaleDateString('es-ES')}
                          </Badge>
                        : null
                    })()}
                  </div>
                </TableCell>
                <TableCell>{member.hours.toFixed(1)}</TableCell>
                <TableCell>
                  <Currency
                    defaultFCA={
                      !Boolean(
                        member.teamMember?.categories.at(-1)?.pointsObrero
                      )
                    }
                    amountIndex={
                      member.teamMember ?
                        calculateHourRateGivenTMCategory(
                          member.teamMember.categories.at(-1)!
                        )
                      : member.category!.amountIndex
                    }
                  />
                </TableCell>
                <TableCell>
                  <Currency
                    defaultFCA={
                      !Boolean(
                        member.teamMember?.categories.at(-1)?.pointsObrero
                      )
                    }
                    amountIndex={multiplyAmountIndex(
                      member.teamMember ?
                        calculateHourRateGivenTMCategory(
                          member.teamMember.categories.at(-1)!
                        )
                      : member.category!.amountIndex,
                      member.hours
                    )}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableHead>
            <TableHeader colSpan={4}>Subtotal</TableHeader>
            <TableHeader>
              <Currency
                amountIndex={sumAmountIndex([
                  calculations.ABTr,
                  calculations.ABTe,
                ])}
              />
            </TableHeader>
          </TableHead>
        </Table>

        {budgetItems.length > 0 && (
          <div className="mt-6">
            <Subheading>Lista de gastos directos</Subheading>

            <Table bleed dense>
              <colgroup>
                <col className="w-1/5" />
                <col className="w-1/5" />
                <col className="w-1/5" />
                <col className="w-1/5" />
                <col className="w-1/5" />
              </colgroup>
              <TableHead>
                <TableRow>
                  <TableHeader colSpan={4}>Detalle</TableHeader>
                  <TableHeader>Total</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {budgetItems.map((item) => (
                  <TableRow key={item.amountIndex.FCA}>
                    <TableCell
                      colSpan={4}
                      className="whitespace-normal text-xs"
                    >
                      {item.detail}
                    </TableCell>

                    <TableCell>
                      <Currency amountIndex={item.amountIndex} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableHead>
                <TableHeader colSpan={4}>Subtotal</TableHeader>
                <TableHeader>
                  <Currency
                    amountIndex={sumAmountIndex([
                      calculations.ABIr,
                      calculations.ABIe,
                    ])}
                  />
                </TableHeader>
              </TableHead>
            </Table>
          </div>
        )}
        <div className="mt-4 flex justify-end">
          <Currency amountIndex={calculations.total} />
        </div>
      </DialogBody>
      <DialogActions>
        <Button plain onClick={() => router.back()}>
          Cerrar
        </Button>
        <Button href={`/anual-budgets/budget/${budget.id}`}>
          Ir al presupuesto
        </Button>
      </DialogActions>
    </Dialog>
  )
}
