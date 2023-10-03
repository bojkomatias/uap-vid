'use server'
import type {
    AnualBudget,
    ProtocolSectionsBudget,
    AnualBudgetItem,
    Execution,
    ProtocolSectionsIdentificationTeam,
    AnualBudgetTeamMember,
    AcademicUnit,
    AcademicUnitBudget,
} from '@prisma/client'
import {
    getAcademicUnitById,
    getAcademicUnitsTabs,
} from '@repositories/academic-unit'
import {
    createAnualBudget,
    createManyAnualBudgetTeamMember,
} from '@repositories/anual-budget'
import { findProtocolById } from '@repositories/protocol'
import { getTeamMembersByIds } from '@repositories/team-member'
import {
    calculateTotalBudgetAggregated,
    type AnualBudgetTeamMemberWithAllRelations,
} from '@utils/anual-budget'
import { dateDifferenceInDays, relativeTimeFormatter } from '@utils/formatters'

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
    // Create the relation between AC and AnualBudgets
    const academicUnitsIds = await generateAnualBudgetAcademicUnitRelation(
        protocol.sections.identification.sponsor
    )
    const data: Omit<
        AnualBudget,
        'id' | 'createdAt' | 'updatedAt' | 'approved'
    > = {
        protocolId: protocol.id,
        year: Number(year),
        budgetItems: ABI,
        academicUnitsIds,
    }
    const newAnualBudget = await createAnualBudget(data)

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
            memberRole: item.role,
            hours: item.hours,
            remainingHours: item.hours,
            executions: [] as Execution[],
        }
    })
}

const generateAnualBudgetAcademicUnitRelation = async (sponsors: string[]) => {
    const parsedSponsors = sponsors.map((s) => s.split(' - ')[1])
    const academicUnits = await getAcademicUnitsTabs()

    return academicUnits
        .filter((e) => parsedSponsors.includes(e.shortname))
        .map((e) => e.id)
}

export const protocolToAnualBudgetPreview = async (
    protocolId: string,
    protocolBudgetItems: ProtocolSectionsBudget,
    protocolTeamMembers: ProtocolSectionsIdentificationTeam[]
) => {
    const ABI = generateAnualBudgetItems(
        protocolBudgetItems,
        new Date().getFullYear().toString()
    )
    const ABT = generateAnualBudgetTeamMembersItems(protocolTeamMembers, null)

    const thereAreTeamMembers =
        ABT.map((x) => x.teamMemberId).filter(Boolean).length > 0

    const teamMembers = thereAreTeamMembers
        ? await getTeamMembersByIds(ABT.map((t) => t.teamMemberId))
        : []

    const ABTWithTeamMemberAndUserData = ABT.map((t) => {
        const teamMember = teamMembers.find((tm) => tm.id === t.teamMemberId)
        return {
            ...t,
            teamMember,
        }
    }) as unknown as Omit<AnualBudgetTeamMemberWithAllRelations, 'id'>[]

    return {
        year: new Date().getFullYear().toString(),
        protocolId: protocolId,
        budgetItems: ABI,
        budgetTeamMembers: ABTWithTeamMemberAndUserData,
    }
}

const getRelativeDateOfLastBudget = (budgets: AcademicUnitBudget[]) => {
    // The 'to' property of the last budget in the array is the date of the last budget change
    const lastBudgetWithTo = budgets.filter((b) => b.to).at(-1)
    const deltaChangeDate = lastBudgetWithTo ? lastBudgetWithTo.from : null
    const deltaChangeFormated = deltaChangeDate ? relativeTimeFormatter.format(
        dateDifferenceInDays(deltaChangeDate),
        'days'
    ) : ''
    return deltaChangeFormated
}

const getAcademicUnitBudgetSummary = (
    academicUnits: AcademicUnit[],
    year: number
) => {
    // Filter the academic unit budgets for the given year
    const academicUnitBudgetForYear = academicUnits
        .map((ac) => ac.budgets)
        .flat()
        .filter((b) => b.from.getFullYear() === year)

    // Calculate the sum of academic unit budget for the given year
    const sumAcademicUnitBudget = academicUnitBudgetForYear
        .filter((b) => !b.to)
        .map((b) => b.amount)
        .reduce((acc, item) => acc + item, 0)

    // Filter the last the academic unit that have budget changes in the given year
    const academicUnitWithLastBudgetChange = academicUnits.filter((ac) => ac.budgets.some((b) => b.to)).sort((a, b) => {
        const aLastBudgetChange = a.budgets.filter((b) => b.from.getFullYear() === year).filter((b) => b.to).at(-1)
        const bLastBudgetChange = b.budgets.filter((b) => b.from.getFullYear() === year).filter((b) => b.to).at(-1)
        if (!aLastBudgetChange || !bLastBudgetChange) return 0
        return aLastBudgetChange.from > bLastBudgetChange.from ? -1 : 1
    }).at(-1)

    // Get the actual and the previous budget in the same year for the academic unit with the last budget change
    const [before, actual] = academicUnitWithLastBudgetChange 
        ? [academicUnitWithLastBudgetChange.budgets.at(-2)?.amount, academicUnitWithLastBudgetChange.budgets.at(-1)?.amount] 
        : [0,0]

    // Calculate a delta value between the actual and the previous budget in the same year
    const deltaValue =  actual && before ? (actual - before) : 0

    // Calculate the delta between the sum of academic unit budget and the previous budget in the same year
    const delta = deltaValue ? ((sumAcademicUnitBudget / (sumAcademicUnitBudget - (deltaValue))) -1 )* 100 : 0


    const changeDate = getRelativeDateOfLastBudget(academicUnitWithLastBudgetChange?.budgets || [])

    return {
        value: sumAcademicUnitBudget,
        delta,
        changeDate,
    }
}

export const getBudgetSummary = async (
    academicUnitId?: string,
    year: number = new Date().getFullYear()
) => {
    // TODO: There is a bug here, the query do not return the anual budgets for some reason
    const academicUnits = await getAcademicUnitById(academicUnitId)
    
    if (!academicUnits)
        return {
            academicUnitBudgetSummary: { value: 0, delta: 0, changeDate: '' },
            projectedBudget: 0,
            spendedBudget: 0,
        }
    
    const anualBudgets = academicUnits.map((ac) => ac.AcademicUnitAnualBudgets).flat()

    // This summary is related to protocols budgets
    const protocolBudgetSummary = calculateTotalBudgetAggregated(anualBudgets)

    // This summary is related to academic unit budgets
    const academicUnitBudgetSummary = getAcademicUnitBudgetSummary(academicUnits, year)

    return {
        academicUnitBudgetSummary,
        projectedBudget: protocolBudgetSummary.total,
        spendedBudget: protocolBudgetSummary.ABIe + protocolBudgetSummary.ABTe,
    }
}

export type BudgetSummaryType = Awaited<ReturnType<typeof getBudgetSummary>>
