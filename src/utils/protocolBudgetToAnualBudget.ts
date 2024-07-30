import type {
  AnualBudgetItem,
  ProtocolSectionsBudget,
  ProtocolSectionsIdentificationTeam,
} from '@prisma/client'
import { getCurrentIndexes } from '@repositories/finance-index'

export const protocolBudgetToAnualBudget = async (
  id: string,
  protocolBudgetItems: ProtocolSectionsBudget,
  protocolTeamMembers: ProtocolSectionsIdentificationTeam[]
) => {
  const prices = await getCurrentIndexes()
  const budgetItems: AnualBudgetItem[] = protocolBudgetItems['expenses']
    .map((e) => {
      return e.data.map((d) => {
        return {
          type: e.type,
          detail: d.detail,
          amount: d.amount,
          remaining: d.amount,
          executions: [],
          amountIndex: {
            FCA: d.amount * prices.currentFCA,
            FMR: d.amount * prices.currentFMR,
          },
          remainingIndex: {
            FCA: d.amount * prices.currentFCA,
            FMR: d.amount * prices.currentFMR,
          },
        }
      })
    })
    .flat()

  // Removed the type cause it's a creation, needs less data than actual schema.
  const teamMembers = protocolTeamMembers.map((t) => {
    return {
      teamMemberId: t.teamMemberId as string,
      role: t.role,
      hours: t.hours,
    }
  })

  return {
    year: new Date().getFullYear(),
    protocolId: id,
    budgetItems: budgetItems,
    budgetTeamMembers: teamMembers,
  }
}
