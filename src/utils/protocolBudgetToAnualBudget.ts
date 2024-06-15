import type {
  AnualBudgetItem,
  ProtocolSectionsBudget,
  ProtocolSectionsIdentificationTeam,
} from '@prisma/client'

export const protocolBudgetToAnualBudget = (
  id: string,
  protocolBudgetItems: ProtocolSectionsBudget,
  protocolTeamMembers: ProtocolSectionsIdentificationTeam[]
) => {
  const budgetItems: AnualBudgetItem[] = protocolBudgetItems['expenses']
    .map((e) => {
      return e.data.map((d) => {
        return {
          type: e.type,
          detail: d.detail,
          amount: d.amount,
          remaining: d.amount,
          executions: [],
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
