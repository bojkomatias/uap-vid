'use server'

// TODO: Fix naming - "anual" should be "annual" throughout the entire codebase for consistency and professionalism

import type { AmountIndex } from '@prisma/client'
import {
  type AnualBudget,
  type ProtocolSectionsBudget,
  type AnualBudgetItem,
  type Execution,
  type ProtocolSectionsIdentificationTeam,
  type AnualBudgetTeamMember,
  type AcademicUnit,
  AnualBudgetState,
  ProtocolState,
  Action,
} from '@prisma/client'
import { getAcademicUnitById } from '@repositories/academic-unit'
import {
  createManyAnualBudgetTeamMember,
  deleteAnualBudgetTeamMembers,
  getAnualBudgetById,
  getAnualBudgetTeamMemberById,
  newBudgetItemExecution,
  newTeamMemberExecution,
  updateAnualBudgetState,
  upsertAnualBudget,
} from '@repositories/anual-budget'
import { getLatestIndexPriceByUnit } from '@repositories/finance-index'
import {
  getLogs,
  updateLogsBudgetIdOnProtocolReactivation,
} from '@repositories/log'
import {
  findProtocolById,
  findProtocolByIdWithBudgets,
  updateProtocolStateById,
} from '@repositories/protocol'
import { getTeamMembersByIds } from '@repositories/team-member'
import {
  BudgetSummaryZero,
  ZeroAmountIndex,
  subtractAmountIndex,
  sumAmountIndex,
} from '@utils/amountIndex'
import {
  calculateTotalBudgetAggregated,
  type AnualBudgetTeamMemberWithAllRelations,
} from '@utils/anual-budget'
import { protocolDuration } from '@utils/constants'
import { WEEKS_IN_MONTH } from '@utils/constants'

/**
 * Generates an annual budget based on a given protocol ID and year.
 * @param protocolId - The ID of the protocol to generate the budget from.
 * @param year - The year to generate the budget for.
 * @returns A Promise that resolves to the generated annual budget, or null if the protocol is not found.
 */
// TODO: This function is too complex and handles multiple responsibilities. Consider breaking it down into smaller functions:
// - generateBudgetItems
// - handleReactivation
// - createTeamMembers
// - updateBudgetState
export const generateAnualBudget = async ({
  protocolId,
  year,
  budgetId,
  reactivated,
}: {
  protocolId: string
  year: number
  budgetId?: string
  reactivated?: boolean
}) => {
  const protocol = await findProtocolById(protocolId)
  if (!protocol) return null

  const oldAB = budgetId ? await getAnualBudgetById(budgetId) : null

  // Create the annual budget with all the items listed in the protocol budget section.
  const ABI = generateAnualBudgetItems(
    protocol?.sections.budget,
    year.toString()
  )

  // Handle the case where the annual budget is reactivated
  // TODO: Extract this reactivation logic into a separate function for better readability
  if (budgetId && reactivated && oldAB) {
    for (let i = 0; i < ABI.length; i++) {
      ABI[i].executions = oldAB.budgetItems[i].executions

      // ABI[].remaining = oldAB.budgetItems[i].remainingIndex - sumatoria de ejecuciones.amountindex
      // TODO: Extract this execution sum calculation into a utility function as it's repeated multiple times
      const executionsSum = oldAB.budgetItems[i].executions.reduce(
        (acc, item) => {
          if (!item || !item.amountIndex) return acc
          acc = sumAmountIndex([acc, item.amountIndex])
          return acc
        },
        { FCA: 0, FMR: 0 } as AmountIndex
      )

      const newRemainig = subtractAmountIndex(
        ABI[i].remainingIndex,
        executionsSum
      )
      ABI[i].remainingIndex = newRemainig
    }
  }

  const data: Omit<AnualBudget, 'id' | 'createdAt' | 'updatedAt' | 'state'> = {
    protocolId: protocol.id,
    year,
    budgetItems: ABI,
    academicUnitsIds: protocol.sections.identification.academicUnitIds,
  }

  const newAnualBudget = await upsertAnualBudget(data, budgetId)
  const duration = protocolDuration(protocol.sections.duration.duration)

  // Generate new annual budget team members
  const ABT = generateAnualBudgetTeamMembers(
    protocol.sections.identification.team,
    newAnualBudget.id,
    duration
  )

  // Handle the case where the annual budget is reactivated
  // TODO: This is duplicate logic from above - consider consolidating reactivation handling
  if (budgetId && reactivated && oldAB) {
    ABT.forEach((newABT) => {
      const oldABT = oldAB?.budgetTeamMembers.find(
        (oldABT) => oldABT.teamMemberId === newABT.teamMemberId
      )

      if (!oldABT) return
      newABT.executions = oldABT?.executions || []

      // TODO: Same execution sum calculation pattern - extract to utility function
      const executionsSum = oldABT.executions.reduce((acc, item) => {
        if (!item.amountIndex) return acc
        sumAmountIndex([acc, item.amountIndex])
        return acc
      }, {} as AmountIndex)

      if (executionsSum?.FCA) {
        const hourlyRateInFCA =
          oldABT.teamMember?.categories.at(-1)?.category.amountIndex?.FCA || 1

        const newRemaining =
          newABT.remainingHours - executionsSum.FCA / hourlyRateInFCA

        newABT.remainingHours = newRemaining
      }
    })

    await updateAnualBudgetState(newAnualBudget.id, AnualBudgetState.APPROVED)
  }

  // If updating an existing budget, delete old team members before creating new ones
  if (budgetId) {
    await deleteAnualBudgetTeamMembers(budgetId)
  }

  // Create new team members
  await createManyAnualBudgetTeamMember(ABT)

  return newAnualBudget.id
}

// TODO: Add proper error handling and consistent return types
export const reactivateProtocolAndAnualBudget = async (protocolId: string) => {
  const protocol = await findProtocolByIdWithBudgets(protocolId)
  const protocolLogs = await getLogs({ protocolId })

  const lastProtocolState = protocolLogs?.at(-1)?.previousState

  // TODO: Implement proper error handling instead of commenting it out
  // This error handling should be implemented or removed entirely
  // if (!protocol || !lastProtocolState)
  //   return {
  //     success: false,
  //     notification: {
  //       title: 'Error',
  //       message: 'Ocurrio un error al reactivar el procotolo.',
  //       intent: 'error',
  //     } as const,
  //   }

  const currentYear = new Date().getFullYear()
  const haveBudgetForCurrentYear = protocol!.anualBudgets.find(
    (b) => b.year === currentYear
  )

  let newBudgetId

  if (haveBudgetForCurrentYear) {
    newBudgetId = await generateAnualBudget({
      protocolId: protocolId,
      year: currentYear,
      budgetId: haveBudgetForCurrentYear.id,
      reactivated: true,
    })
  }

  if (newBudgetId)
    await updateLogsBudgetIdOnProtocolReactivation(protocolId, newBudgetId)

  // TODO: Add null safety check for newBudgetId - using non-null assertion (!) can cause runtime errors
  return await updateProtocolStateById(
    protocolId,
    Action.REACTIVATE,
    ProtocolState.DISCONTINUED,
    ProtocolState.ON_GOING,
    undefined,
    newBudgetId!
  )
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
          detail: d.detail,
          amount: null,
          remaining: null,
          executions: [] as Execution[],
          amountIndex: d.amountIndex,
          remainingIndex: d.amountIndex,
        }
      })
    acc.push(...budgetItems)
    return acc
  }, [] as AnualBudgetItem[])
}


// TODO: review this function again. We want an specific assignment, not the last one.

const generateAnualBudgetTeamMembers = (
  protocolTeam: ProtocolSectionsIdentificationTeam[],
  anualBudgetId: string | null,
  duration: number
): Omit<AnualBudgetTeamMember, 'id'>[] => {
  // TODO: Remove @ts-ignore and fix the proper typing instead of suppressing errors
  // @ts-ignore (remove later)
  return protocolTeam.map((item) => {
    //If the team member has assigned "custom" workingMonths, those months will be used to calculate the amount of hours in total.

    const hoursAssigned =
      item.assignments.filter((a) => !a.to).at(0)?.hours ?? 0

    const hours = Math.ceil(
      item.workingMonths && item.workingMonths > 0 ?
        hoursAssigned * item.workingMonths * WEEKS_IN_MONTH
      : hoursAssigned * duration
    )

    if (item.toBeConfirmed && item.categoryToBeConfirmed) {
      return {
        anualBudgetId: anualBudgetId,
        memberRole: item.role,
        hours: hours,
        remainingHours: hours,
        categoryId: item.categoryToBeConfirmed,
        executions: [] as Execution[],
      }
    }
    return {
      anualBudgetId: anualBudgetId,
      teamMemberId: item.teamMemberId,
      memberRole: item.role,
      hours: hours,
      remainingHours: hours,
      executions: [] as Execution[],
    }
  })
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
  const ABT = generateAnualBudgetTeamMembers(
    protocolTeamMembers,
    null,
    duration
  )

  // TODO: Optimize this check - use .some() instead of .map().filter().length for better performance
  const thereAreTeamMembers =
    ABT.map((x) => x.teamMemberId).filter(Boolean).length > 0
  // Better: ABT.some(x => x.teamMemberId)

  const teamMembers =
    thereAreTeamMembers ?
      await getTeamMembersByIds(
        ABT.map((t) => t.teamMemberId).filter((id) => id !== null) as string[]
      )
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

const transformAmountToAmountIndex = async (amount: number) => {
  const fcaPrice = (await getLatestIndexPriceByUnit('FCA')) || 0
  const fmrPrice = (await getLatestIndexPriceByUnit('FMR')) || 0

  const amountInFCA = amount / fcaPrice
  const amountInFMR = amount / fmrPrice

  return {
    FCA: amountInFCA,
    FMR: amountInFMR,
  } as AmountIndex
}

export const saveNewTeamMemberExecution = async (
  amount: number,
  anualBudgetTeamMemberId: string
) => {
  const anualBudgetTeamMember = await getAnualBudgetTeamMemberById(
    anualBudgetTeamMemberId
  )

  if (!anualBudgetTeamMember) return null

  const amountIndex = await transformAmountToAmountIndex(amount)

  // In this cases team members will exist. Cannot have executions over plain categories.
  // TODO: Define this magic number (1) as a named constant for better maintainability
  const hourlyRateInFCA =
    anualBudgetTeamMember.teamMember!.categories.at(-1)?.category.amountIndex
      ?.FCA || 1

  const amountExcecutedInHours =
    hourlyRateInFCA ? amountIndex.FCA / hourlyRateInFCA : 0

  const remainingHours =
    anualBudgetTeamMember.remainingHours - amountExcecutedInHours

  // TODO: Use proper null checking instead of non-null assertion (!) which can cause runtime errors
  if (!anualBudgetTeamMember.teamMember!.academicUnitId) {
    return null
  }

  const updated = await newTeamMemberExecution(
    anualBudgetTeamMemberId,
    amountIndex,
    remainingHours,
    anualBudgetTeamMember.teamMember!.academicUnitId
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
  // TODO: Consider converting budget items to a proper Prisma model for better type safety and data consistency
  const amountIndex = await transformAmountToAmountIndex(amount)

  const updatedBudgetItem = anualBudget?.budgetItems.map((item, index) => {
    if (index === budgetItemIndex) {
      item.executions.push({
        academicUnitId,
        amount: null,
        amountIndex,
        date: new Date(),
      })
      item.remainingIndex = subtractAmountIndex(
        item.remainingIndex,
        amountIndex
      )
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
    .map((b) => b.amountIndex)
    .filter(Boolean)
    .reduce((acc, item) => {
      //check null
      if (!item) return acc
      if (!acc) return item
      acc = sumAmountIndex([acc, item])
      return acc
    }, {} as AmountIndex)

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
        academicUnitWithLastBudgetChange.budgets.at(-2)?.amountIndex,
        academicUnitWithLastBudgetChange.budgets.at(-1)?.amountIndex,
      ]
    : [ZeroAmountIndex, ZeroAmountIndex]

  if (!actual)
    return { value: ZeroAmountIndex, delta: ZeroAmountIndex, changeDate: '' }

  // Calculate a delta value between the actual and the previous budget in the same year
  const deltaValue =
    actual && before ? subtractAmountIndex(actual, before) : actual

  // Calculate the delta between the sum of academic unit budget and the previous budget in the same year
  const delta =
    deltaValue && sumAcademicUnitBudget ?
      {
        FCA:
          (sumAcademicUnitBudget.FCA /
            (sumAcademicUnitBudget.FCA - deltaValue.FCA) -
            1) *
          100,
        FMR:
          (sumAcademicUnitBudget.FMR /
            (sumAcademicUnitBudget.FMR - deltaValue.FMR) -
            1) *
          100,
      }
    : ZeroAmountIndex

  return {
    value: sumAcademicUnitBudget,
    delta,
  }
}

// TODO: This function uses JSON.stringify for deduplication which is inefficient and unreliable
// Consider using a more efficient approach like creating a proper key based on specific properties
// or using a Set with a proper comparison function
const removeDuplicates = (
  inputArray: (AnualBudget & {
    budgetTeamMembers: AnualBudgetTeamMemberWithAllRelations[]
  })[]
) => {
  const uniqueArray = []
  const seenItems = new Set()

  for (const item of inputArray) {
    const budgetItems = item.budgetItems
    // TODO: JSON.stringify for object comparison is inefficient and can be unreliable
    // Consider using a more robust deduplication strategy
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

  if (!academicUnits) return BudgetSummaryZero

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

  const projectedBudgetSummary = { value: protocolBudgetSummary.totalPeding }

  const projectedBudgetSummaryApproved = {
    value: protocolBudgetSummary.totalApproved,
  }

  return {
    academicUnitBudgetSummary,
    projectedBudgetSummary,
    projectedBudgetSummaryApproved,
    spendedBudget: sumAmountIndex([
      protocolBudgetSummary.ABIe,
      protocolBudgetSummary.ABTe,
    ]),
  }
}

export type BudgetSummaryType = Awaited<ReturnType<typeof getBudgetSummary>>

// TODO: Additional improvements to consider:
// 1. Add comprehensive JSDoc comments for all functions
// 2. Implement proper error handling with consistent return types
// 3. Create utility functions for common operations (execution sum calculations, etc.)
// 4. Add input validation for all functions
// 5. Consider using Result/Either pattern for better error handling
// 6. Add unit tests for all functions
// 7. Consider breaking this file into smaller, more focused modules
// 8. Fix the "anual" vs "annual" naming inconsistency throughout the codebase
// 9. Replace magic numbers with named constants
// 10. Improve type safety by removing @ts-ignore and non-null assertions
// 11. Optimize performance in array operations and object comparisons
// 12. Consider implementing proper data models for better type safety
