'use server'

import {
  type AnualBudget,
  type ProtocolSectionsBudget,
  type AnualBudgetItem,
  type Execution,
  type ProtocolSectionsIdentificationTeam,
  type AnualBudgetTeamMember,
  type AcademicUnit,
  AnualBudgetState,
} from '@prisma/client'
import {
  getAcademicUnitById,
  getAcademicUnitsTabs,
} from '@repositories/academic-unit'
import {
  createAnualBudget,
  createManyAnualBudgetTeamMember,
  getAnualBudgetById,
  getAnualBudgetTeamMemberById,
  newBudgetItemExecution,
  newTeamMemberExecution,
} from '@repositories/anual-budget'
import { findProtocolById } from '@repositories/protocol'
import { getTeamMembersByIds } from '@repositories/team-member'
import {
  calculateTotalBudgetAggregated,
  type AnualBudgetTeamMemberWithAllRelations,
} from '@utils/anual-budget'
import { protocolDuration } from '@utils/anual-budget/protocol-duration'
import { WEEKS_IN_MONTH } from '@utils/constants'

/**
 * Generates an annual budget based on a given protocol ID and year.
 * @param protocolId - The ID of the protocol to generate the budget from.
 * @param year - The year to generate the budget for.
 * @returns A Promise that resolves to the generated annual budget, or null if the protocol is not found.
 */
export const generateAnualBudget = async (protocolId: string, year: string) => {
  const protocol = await findProtocolById(protocolId)
  //The next few lines of code are to check if there's a generated budget for the protocol already. The logic behind is as it follows: if it finds budgets, it's because there's already a created budget. I also check for the specific year, to be able to generate a new budget for the following year when necessary.
  const anualBudgetIds = protocol?.anualBudgetIds
  const anualBudgetsYears = await Promise.all(
    (anualBudgetIds || []).map(async (id) => {
      return await getAnualBudgetById(id).then((res) => {
        return res?.year
      })
    })
  )

  if (!protocol || anualBudgetsYears.includes(new Date().getFullYear()))
    return null

  // Create the annual budget with all the items listed in the protocol budget section.
  const ABI = generateAnualBudgetItems(protocol?.sections.budget, year)
  // Create the relation between AC and AnualBudgets
  const academicUnitsIds = await generateAnualBudgetAcademicUnitRelation(
    protocol.sections.identification.sponsor
  )
  const data: Omit<AnualBudget, 'id' | 'createdAt' | 'updatedAt' | 'state'> = {
    protocolId: protocol.id,
    year: Number(year),
    budgetItems: ABI,
    academicUnitsIds,
  }
  const newAnualBudget = await createAnualBudget(data)

  const duration = protocolDuration(protocol.sections.duration.duration)

  // Once the annual budget is created, create the annual budget team members with the references to the annual budget.
  const ABT = generateAnualBudgetTeamMembersItems(
    protocol.sections.identification.team,
    newAnualBudget.id,
    duration
  )

  await createManyAnualBudgetTeamMember(ABT)
  //Added this return to check if the budget was created
  return newAnualBudget.id
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
          //Esto es para que no jodan los tipos
          amountIndex: null,
          remainingIndex: null,
        }
      })
    acc.push(...budgetItems)
    return acc
  }, [] as AnualBudgetItem[])
}

const generateAnualBudgetTeamMembersItems = (
  protocolTeam: ProtocolSectionsIdentificationTeam[],
  anualBudgetId: string | null,
  duration: number
): Omit<AnualBudgetTeamMember, 'id'>[] => {
  return protocolTeam.map((item) => {
    return {
      anualBudgetId: anualBudgetId,
      teamMemberId: item.teamMemberId!,
      memberRole: item.role,
      //If the team member has assigned "custom" workingMonths, those months will be used to calculate the amount of hours in total.
      hours: Math.ceil(
        item.workingMonths && item.workingMonths > 0 ?
          item.hours * item.workingMonths * WEEKS_IN_MONTH
        : item.hours * duration
      ),
      remainingHours: Math.ceil(
        item.workingMonths && item.workingMonths > 0 ?
          item.hours * item.workingMonths * WEEKS_IN_MONTH
        : item.hours * duration
      ),
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
  protocolTeamMembers: ProtocolSectionsIdentificationTeam[],
  duration: number
) => {
  const ABI = generateAnualBudgetItems(
    protocolBudgetItems,
    new Date().getFullYear().toString()
  )
  const ABT = generateAnualBudgetTeamMembersItems(
    protocolTeamMembers,
    null,
    duration
  )

  const thereAreTeamMembers =
    ABT.map((x) => x.teamMemberId).filter(Boolean).length > 0

  const teamMembers =
    thereAreTeamMembers ?
      await getTeamMembersByIds(ABT.map((t) => t.teamMemberId))
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

export const saveNewTeamMemberExecution = async (
  amount: number,
  anualBudgetTeamMemberId: string
) => {
  const anualBudgetTeamMember = await getAnualBudgetTeamMemberById(
    anualBudgetTeamMemberId
  )

  if (!anualBudgetTeamMember) return null

  const hourlyRate =
    anualBudgetTeamMember.teamMember.categories.at(-1)?.category.price.at(-1)
      ?.price || 0

  const amountExcecutedInHours = hourlyRate ? amount / hourlyRate : 0

  const remainingHours =
    anualBudgetTeamMember.remainingHours - amountExcecutedInHours

  if (!anualBudgetTeamMember.teamMember.academicUnitId) {
    return null
  }

  const updated = await newTeamMemberExecution(
    anualBudgetTeamMemberId,
    amount,
    remainingHours,
    anualBudgetTeamMember.teamMember.academicUnitId
  )
  return updated
}

export const saveNewItemExecution = async (
  academicUnitId: string,
  budgetItemIndex: number,
  anualBudgetId: string,
  amount: number
) => {
  const anualBudget = await getAnualBudgetById(anualBudgetId)

  if (!anualBudget) return null

  // As the budget items are'nt a prisma model, we need to update the budget item manually and update the whole list.
  // A good solution would be transform budget items into a prisma model, but requires various minor fixes in the code, most of them related with custom types.
  const updatedBudgetItem = anualBudget?.budgetItems.map((item, index) => {
    if (index === budgetItemIndex) {
      item.executions.push({
        academicUnitId,
        amount,
        date: new Date(),
      })
      item.remaining =
        item.amount -
        item.executions.reduce((acc, item) => acc + item.amount, 0)
    }
    return item
  })

  const updated = await newBudgetItemExecution(anualBudgetId, updatedBudgetItem)
  return updated
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
    // @ts-ignore @Amilcar is fixing this probably
    .reduce((acc, item) => acc + item, 0)

  // Filter the last the academic unit that have budget changes in the given year
  const academicUnitWithLastBudgetChange = academicUnits
    .filter((ac) => ac.budgets.some((b) => b.to))
    .sort((a, b) => {
      const aLastBudgetChange = a.budgets
        .filter((b) => b.from.getFullYear() === year)
        .filter((b) => b.to)
        .at(-1)
      const bLastBudgetChange = b.budgets
        .filter((b) => b.from.getFullYear() === year)
        .filter((b) => b.to)
        .at(-1)
      if (!aLastBudgetChange || !bLastBudgetChange) return 0
      return aLastBudgetChange.from < bLastBudgetChange.from ? -1 : 1
    })
    .at(-1)

  // Get the actual and the previous budget in the same year for the academic unit with the last budget change
  const [before, actual] =
    academicUnitWithLastBudgetChange ?
      [
        academicUnitWithLastBudgetChange.budgets.at(-2)?.amount,
        academicUnitWithLastBudgetChange.budgets.at(-1)?.amount,
      ]
    : [0, 0]

  if (!actual) return { value: 0, delta: 0, changeDate: '' }

  // Calculate a delta value between the actual and the previous budget in the same year
  const deltaValue = actual && before ? actual - before : actual

  // Calculate the delta between the sum of academic unit budget and the previous budget in the same year
  const delta =
    deltaValue ?
      // @ts-ignore @Amilcar is fixing this probably
      (sumAcademicUnitBudget / (sumAcademicUnitBudget - deltaValue) - 1) * 100
    : 0

  return {
    value: sumAcademicUnitBudget,
    delta,
  }
}

const getProjectedBudgetSummary = (
  total: number,
  anualBudgets: Array<
    AnualBudget & {
      budgetTeamMembers: AnualBudgetTeamMemberWithAllRelations[]
    }
  >,
  year: number
) => {
  const lastCategoryWithPriceChange = anualBudgets
    .filter((b) => b.year === year)
    .map((b) => b.budgetTeamMembers)
    .flat()
    .map((b) => b.teamMember.categories)
    .flat()
    .filter((c) => c.category.price.some((p) => p.to))
    .sort((a, b) => {
      const aLastPriceChange = a.category.price.filter((p) => p.to).at(-1)
      const bLastPriceChange = b.category.price.filter((p) => p.to).at(-1)
      if (!aLastPriceChange || !bLastPriceChange) return 0
      return aLastPriceChange.from < bLastPriceChange.from ? -1 : 1
    })
    .at(-1)
  const [before, actual] = [
    lastCategoryWithPriceChange?.category.price.at(-2),
    lastCategoryWithPriceChange?.category.price.at(-1),
  ]

  const deltaValue =
    actual && before ? actual.price - before.price : actual?.price

  const delta = deltaValue ? (total / (total - deltaValue) - 1) * 100 : 0

  return {
    value: total,
    delta: delta,
  }
}

function removeDuplicates(
  inputArray: (AnualBudget & {
    budgetTeamMembers: AnualBudgetTeamMemberWithAllRelations[]
  })[]
) {
  const uniqueArray = []
  const seenItems = new Set()

  for (const item of inputArray) {
    const budgetItems = item.budgetItems
    const key = JSON.stringify(budgetItems)

    if (!seenItems.has(key)) {
      uniqueArray.push(item)
      seenItems.add(key)
    }
  }

  return uniqueArray
}

export const getBudgetSummary = async (
  academicUnitId?: string,
  year: number = new Date().getFullYear()
) => {
  const academicUnits = await getAcademicUnitById(academicUnitId)

  if (!academicUnits)
    return {
      academicUnitBudgetSummary: { value: 0, delta: 0 },
      projectedBudgetSummary: { value: 0, delta: 0 },
      projectedBudgetSummaryApproved: { value: 0, delta: 0 },
      spendedBudget: 0,
    }
  const list = academicUnits.map((ac) => ac.AcademicUnitAnualBudgets).flat()
  const anualBudgets = removeDuplicates(list).filter(
    (ab) => ab.state !== AnualBudgetState.REJECTED
  )

  // This summary is related to protocols budgets
  const protocolBudgetSummary = calculateTotalBudgetAggregated(
    anualBudgets,
    academicUnitId
  )

  // This summary is related to academic unit budgets
  const academicUnitBudgetSummary = getAcademicUnitBudgetSummary(
    academicUnits,
    year
  )

  const projectedBudgetSummary = getProjectedBudgetSummary(
    protocolBudgetSummary.total,
    anualBudgets,
    year
  )

  const projectedBudgetSummaryApproved = getProjectedBudgetSummary(
    protocolBudgetSummary.total,
    anualBudgets.filter((e) => e.state !== AnualBudgetState.PENDING),
    year
  )

  return {
    academicUnitBudgetSummary,
    projectedBudgetSummary,
    projectedBudgetSummaryApproved,
    spendedBudget: protocolBudgetSummary.ABIe + protocolBudgetSummary.ABTe,
  }
}

export type BudgetSummaryType = Awaited<ReturnType<typeof getBudgetSummary>>
