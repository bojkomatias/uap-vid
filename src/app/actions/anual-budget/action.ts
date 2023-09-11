'use server'

import type { AnualBudget, ProtocolSectionsBudget, AnualBudgetItem, Execution, ProtocolSectionsIdentificationTeam, AnualBudgetTeamMember } from '@prisma/client'
import {
    createAnualBudgetV2,
    createManyAnualBudgetTeamMember,
} from '@repositories/anual-budget'
import { findProtocolById } from '@repositories/protocol'
import { getTeamMembers, getTeamMembersByIds } from '@repositories/team-member'
import { prisma } from '../../../utils/bd'
import type { AnualBudgetTeamMemberWithAllRelations } from '@utils/anual-budget'

/**
 * Generates an annual budget based on a given protocol ID and year.
 * @param protocolId - The ID of the protocol to generate the budget from.
 * @param year - The year to generate the budget for.
 * @returns A Promise that resolves to the generated annual budget, or null if the protocol is not found.
 */
export const generateAnualBudget = async (protocolId: string, year: string) => {
    const protocol = await findProtocolById(protocolId)
    if (!protocol) return null

    // Create the annual budget with all the items listed in the protocol budget section.
    const ABI = generateAnualBudgetItems(protocol?.sections.budget, year)
    const data: Omit<AnualBudget, 'id'| 'createdAt' | 'updatedAt'>  = {
        protocolId: protocol.id,
        year: Number(year),
        budgetItems: ABI,
    }
    const newAnualBudget = await createAnualBudgetV2(data)

    // Once the annual budget is created, create the annual budget team members with the references to the annual budget.
    const ABT = generateAnualBudgetTeamMembersItems(
        protocol.sections.identification.team,
        newAnualBudget.id
    )

    await createManyAnualBudgetTeamMember(ABT)
}

// Utilities for generating the annual budget from a protocol.
const generateAnualBudgetItems = (
    protocolBudgetSection: ProtocolSectionsBudget,
    year: string
): AnualBudgetItem[] => {
    return protocolBudgetSection.expenses.reduce((acc, item) => {
        const budgetItems = item.data
            .filter((d) => d.year === year)
            .map((d) => {
                return {
                    type: item.type,
                    amount: d.amount,
                    detail: d.detail,
                    remaining: d.amount,
                    executions: [] as Execution[],
                }
            })
        acc.push(...budgetItems)
        return acc
    }, [] as AnualBudgetItem[])
}

const generateAnualBudgetTeamMembersItems = (
    protocolTeam: ProtocolSectionsIdentificationTeam[],
    anualBudgetId: string | null
): Omit<AnualBudgetTeamMember, 'id'>[] => {
    return protocolTeam.map((item) => {
        return {
            anualBudgetId: anualBudgetId,
            teamMemberId: item.teamMemberId!,
            hours: item.hours,
            remainingHours: item.hours,
            executions: [] as Execution[],
        }
    })
}

export const protocolToAnualBudgetPreview = async (protocolId: string,
    protocolBudgetItems: ProtocolSectionsBudget,
    protocolTeamMembers: ProtocolSectionsIdentificationTeam[]) => {
        const ABI = generateAnualBudgetItems(protocolBudgetItems, new Date().getFullYear().toString())
        const ABT = generateAnualBudgetTeamMembersItems(protocolTeamMembers, null)

        const thereAreTeamMembers = ABT.map(x=>x.teamMemberId).filter(Boolean).length > 0

        const teamMembers = thereAreTeamMembers ? await getTeamMembersByIds(ABT.map((t) => t.teamMemberId)) : []

        const ABTWithTeamMemberAndUserData = ABT.map((t) => {
            const teamMember = teamMembers.find((tm) => tm.id === t.teamMemberId)
            return {
                ...t,
                teamMember
            }
        }) as unknown as Omit<AnualBudgetTeamMemberWithAllRelations, 'id'>[]
            
        return {
            year: new Date().getFullYear().toString(),
            protocolId: protocolId,
            budgetItems: ABI,
            budgetTeamMembers: ABTWithTeamMemberAndUserData
        }
    }