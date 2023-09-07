import type {
    AnualBudget,
    AnualBudgetItem,
    AnualBudgetTeamMember,
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
                    executions: [],
                }
            })
        })
        .flat()
    const teamMembers: AnualBudgetTeamMember[] = protocolTeamMembers.map(
        (t) => {
            return {
                id: '',
                teamMemberId: t.teamMemberId as string,
                hours: t.hours,
                remainingHours: t.hours,
                anualBudgetId: null,
                executions: [],
            }
        }
    )

    return {
        id: '',
        createdAt: null,
        updatedAt: null,
        year: new Date().getFullYear(),
        protocolId: id,
        budgetItems: budgetItems,
        budgetTeamMembers: teamMembers,
    } as AnualBudget
}
