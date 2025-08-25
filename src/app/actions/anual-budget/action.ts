'use server'

// TODO: Fix naming - "anual" should be "annual" throughout the entire codebase for consistency and professionalism

import type { AmountIndex, AcademicUnitBudget } from '@prisma/client'
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

// Define AcademicUnit with budgets relation for use in this file
type AcademicUnitWithBudgets = AcademicUnit & {
  budgets?: AcademicUnitBudget[]
}
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
import {
  getLatestIndexPriceByUnit,
  getCurrentIndexes,
} from '@repositories/finance-index'
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
import { prisma } from 'utils/bd'

// Utility function to calculate execution sum safely
const calculateExecutionsSum = async (
  executions: Execution[]
): Promise<AmountIndex> => {
  // Get current exchange rates
  const indexes = await getCurrentIndexes()
  const { currentFCA, currentFMR } = indexes

  const totalAmount = executions.reduce((acc, execution) => {
    return acc + (execution.amount ?? 0)
  }, 0)

  // Convert total amount to AmountIndex using current exchange rates
  return {
    FCA: totalAmount / currentFCA,
    FMR: totalAmount / currentFMR,
  } as AmountIndex
}

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
  const budgetItemsData = generateAnualBudgetItems(
    protocol?.sections.budget,
    year.toString()
  )

  const data: Omit<AnualBudget, 'id' | 'createdAt' | 'updatedAt' | 'state'> = {
    protocolId: protocol.id,
    year,
    academicUnitsIds: protocol.sections.identification.academicUnitIds,
  }

  const newAnualBudget = await upsertAnualBudget(data, budgetId)

  let budgetItems: any[] = []

  // Handle budget items differently based on whether this is a reactivation
  if (budgetId && reactivated && oldAB && oldAB.budgetItems) {
    // For reactivation: Update existing budget items instead of creating new ones
    console.log('🔄 Reactivation: Updating existing budget items...')

    // Get the original protocol budget data to restore correct amounts
    const protocolBudget = protocol.sections.budget
    const originalBudgetItemsData = protocolBudget.expenses.reduce(
      (acc: any[], item: any) => {
        const budgetItems = item.data
          .filter((d: any) => d.year === year.toString())
          .map((d: any) => ({
            type: item.type,
            detail: d.detail,
            amountIndex: d.amountIndex,
          }))
        acc.push(...budgetItems)
        return acc
      },
      []
    )

    // Update existing budget items with correct amounts
    budgetItems = []
    for (
      let i = 0;
      i < Math.min(oldAB.budgetItems.length, originalBudgetItemsData.length);
      i++
    ) {
      const oldItem = oldAB.budgetItems[i]
      const originalItem = originalBudgetItemsData[i]

      if (!oldItem || !originalItem) continue

      // Calculate total executed amount for this item using actual amounts
      const executedAmount = await calculateExecutionsSum(oldItem.executions)

      // Calculate remaining amount: original amount - executed amount
      const remainingAmount = subtractAmountIndex(
        originalItem.amountIndex,
        executedAmount
      )

      // Update the existing budget item
      const updatedItem = await prisma.anualBudgetItem.update({
        where: { id: oldItem.id },
        data: {
          amountIndex: originalItem.amountIndex,
          remainingIndex: remainingAmount,
        },
        include: {
          executions: {
            include: {
              academicUnit: true,
            },
            orderBy: {
              date: 'desc',
            },
          },
        },
      })

      budgetItems.push(updatedItem)
    }

    // If there are more items in the protocol than in the old budget, create the new ones
    if (originalBudgetItemsData.length > oldAB.budgetItems.length) {
      const newItemsData = originalBudgetItemsData.slice(
        oldAB.budgetItems.length
      )
      const newItems = await Promise.all(
        newItemsData.map(async (item) => {
          return await prisma.anualBudgetItem.create({
            data: {
              ...item,
              remainingIndex: item.amountIndex, // New items have full remaining amount
              anualBudgetId: newAnualBudget.id,
            },
          })
        })
      )
      budgetItems.push(...newItems)
    }
  } else {
    // Normal flow: Create new budget items
    budgetItems = await Promise.all(
      budgetItemsData.map(async (item) => {
        return await prisma.anualBudgetItem.create({
          data: {
            ...item,
            anualBudgetId: newAnualBudget.id,
          },
        })
      })
    )
  }

  const duration = protocolDuration(protocol.sections.duration.duration)

  // Generate new annual budget team members
  const ABT = generateAnualBudgetTeamMembers(
    protocol.sections.identification.team,
    newAnualBudget.id,
    duration
  )

  // Handle the case where the annual budget is reactivated - FIXED VERSION
  if (budgetId && reactivated && oldAB && oldAB.budgetTeamMembers) {
    // For reactivation, update existing team members instead of deleting/recreating
    // This preserves the execution connections

    const updatedTeamMembers: string[] = []

    // Update existing team members with correct hours and remaining hours
    for (const newABT of ABT) {
      const oldABT = oldAB.budgetTeamMembers.find(
        (oldABT) =>
          oldABT.teamMemberId === newABT.teamMemberId ||
          (oldABT.categoryId === newABT.categoryId && newABT.categoryId)
      )

      if (oldABT) {
        // Update existing team member budget
        const executionsSum = await calculateExecutionsSum(
          oldABT.executions || []
        )

        let newRemainingHours = newABT.remainingHours

        if (executionsSum?.FCA && oldABT.teamMember?.categories?.length) {
          const hourlyRateInFCA =
            oldABT.teamMember.categories.at(-1)?.category.amountIndex?.FCA || 1
          const hoursExecuted = executionsSum.FCA / hourlyRateInFCA
          newRemainingHours = Math.max(0, newABT.remainingHours - hoursExecuted)
        }

        await prisma.anualBudgetTeamMember.update({
          where: { id: oldABT.id },
          data: {
            memberRole: newABT.memberRole,
            hours: newABT.hours,
            remainingHours: newRemainingHours,
            teamMemberId: newABT.teamMemberId,
            categoryId: newABT.categoryId,
          },
        })

        updatedTeamMembers.push(oldABT.id)
      } else {
        // Create new team member budget for newly added members
        await prisma.anualBudgetTeamMember.create({
          data: {
            ...newABT,
            anualBudgetId: newAnualBudget.id,
          },
        })
      }
    }

    // Remove team members that are no longer in the protocol (zero out remaining hours)
    const teamMembersToDeactivate = oldAB.budgetTeamMembers.filter(
      (oldABT) => !updatedTeamMembers.includes(oldABT.id)
    )

    for (const memberToDeactivate of teamMembersToDeactivate) {
      await prisma.anualBudgetTeamMember.update({
        where: { id: memberToDeactivate.id },
        data: {
          hours: memberToDeactivate.hours - memberToDeactivate.remainingHours, // Keep only executed hours
          remainingHours: 0, // Zero out remaining hours
        },
      })
    }

    await updateAnualBudgetState(newAnualBudget.id, AnualBudgetState.APPROVED)
  } else {
    // Normal flow: If not reactivating, or updating an existing budget, delete old team members before creating new ones
    if (budgetId) {
      await deleteAnualBudgetTeamMembers(budgetId)
    }

    // Create new team members
    await createManyAnualBudgetTeamMember(ABT)
  }

  return newAnualBudget.id
}

// TODO: Add proper error handling and consistent return types
export const reactivateProtocolAndAnualBudget = async (protocolId: string) => {
  try {
    const protocol = await findProtocolByIdWithBudgets(protocolId)
    const protocolLogs = await getLogs({ protocolId })

    // Proper error handling instead of commenting it out
    if (!protocol) {
      return {
        status: false,
        notification: {
          title: 'Error',
          message: 'No se encontró el protocolo especificado.',
          intent: 'error',
        } as const,
      }
    }

    const lastProtocolState = protocolLogs?.at(-1)?.previousState

    const currentYear = new Date().getFullYear()
    const haveBudgetForCurrentYear = protocol.anualBudgets.find(
      (b) => b.year === currentYear
    )

    let newBudgetId: string | null = null

    // Create or regenerate budget for current year
    if (haveBudgetForCurrentYear) {
      newBudgetId = await generateAnualBudget({
        protocolId: protocolId,
        year: currentYear,
        budgetId: haveBudgetForCurrentYear.id,
        reactivated: true,
      })
    } else {
      // Generate new budget if no budget exists for current year
      newBudgetId = await generateAnualBudget({
        protocolId: protocolId,
        year: currentYear,
        reactivated: false,
      })
    }

    // Validate that budget generation was successful
    if (!newBudgetId) {
      return {
        status: false,
        notification: {
          title: 'Error',
          message:
            'No se pudo generar el presupuesto anual durante la reactivación.',
          intent: 'error',
        } as const,
      }
    }

    // Update logs with new budget ID
    if (newBudgetId) {
      await updateLogsBudgetIdOnProtocolReactivation(protocolId, newBudgetId)
    }

    // Update protocol state with proper null safety
    const result = await updateProtocolStateById(
      protocolId,
      Action.REACTIVATE,
      lastProtocolState || ProtocolState.DISCONTINUED,
      ProtocolState.ON_GOING,
      undefined,
      newBudgetId
    )

    return result
  } catch (error) {
    console.error('Error reactivating protocol and annual budget:', error)
    return {
      status: false,
      notification: {
        title: 'Error',
        message:
          'Ocurrió un error inesperado al reactivar el protocolo y presupuesto.',
        intent: 'error',
      } as const,
    }
  }
}

// Utilities for generating the annual budget from a protocol.
const generateAnualBudgetItems = (
  protocolBudgetSection: ProtocolSectionsBudget,
  year: string
): Omit<
  AnualBudgetItem,
  'id' | 'createdAt' | 'updatedAt' | 'anualBudgetId'
>[] => {
  return protocolBudgetSection.expenses.reduce(
    (acc, item) => {
      const budgetItems = item.data
        .filter((d) => d.year === year)
        .map((d) => {
          return {
            type: item.type,
            detail: d.detail,
            amount: null,
            remaining: null,
            amountIndex: d.amountIndex,
            remainingIndex: d.amountIndex,
          }
        })
      acc.push(...budgetItems)
      return acc
    },
    [] as Omit<
      AnualBudgetItem,
      'id' | 'createdAt' | 'updatedAt' | 'anualBudgetId'
    >[]
  )
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
      item.assignments.filter((a) => !a.to).at(0)?.hours ?? 1

    const hours = Math.max(
      1,
      Math.ceil(
        item.workingMonths && item.workingMonths > 0 ?
          hoursAssigned * item.workingMonths * WEEKS_IN_MONTH
        : hoursAssigned * duration
      )
    )

    if (item.toBeConfirmed && item.categoryToBeConfirmed) {
      return {
        anualBudgetId: anualBudgetId,
        memberRole: item.role,
        hours: hours,
        remainingHours: hours,
        categoryId: item.categoryToBeConfirmed,
      }
    }
    return {
      anualBudgetId: anualBudgetId,
      teamMemberId: item.teamMemberId,
      memberRole: item.role,
      hours: hours,
      remainingHours: hours,
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
    anualBudgetTeamMember.teamMember!.academicUnitId,
    Number(amount)
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

  // Get the budget item by index
  const budgetItem = anualBudget.budgetItems[budgetItemIndex]
  if (!budgetItem) return null

  const amountIndex = await transformAmountToAmountIndex(amount)

  // Calculate new remaining amount
  const newRemainingIndex = subtractAmountIndex(
    budgetItem.remainingIndex,
    amountIndex
  )

  // Create execution and update budget item using the new function
  const updated = await newBudgetItemExecution(
    budgetItem.id,
    amountIndex,
    newRemainingIndex,
    academicUnitId,
    Number(amount)
  )

  return updated
}

const getAcademicUnitBudgetSummary = async (
  academicUnitIds: string[],
  year: number
) => {
  try {
    // Directly fetch budgets for the specific year from each academic unit
    const budgetPromises = academicUnitIds.map(async (academicUnitId) => {
      return await prisma.academicUnitBudget.findUnique({
        where: {
          academicUnitId_year: {
            academicUnitId,
            year,
          },
        },
      })
    })

    const budgets = (await Promise.all(budgetPromises)).filter(Boolean)

    // Calculate the sum of all academic unit budgets for the given year
    const sumAcademicUnitBudget = budgets
      .map((b) => b!.amountIndex)
      .filter(Boolean)
      .reduce((acc, item) => {
        if (!item) return acc
        if (!acc || (!acc.FCA && !acc.FMR)) return item
        return sumAmountIndex([acc, item])
      }, ZeroAmountIndex)

    // For delta calculation, try to get previous year's budget
    const previousYear = year - 1
    const previousBudgetPromises = academicUnitIds.map(
      async (academicUnitId) => {
        return await prisma.academicUnitBudget.findUnique({
          where: {
            academicUnitId_year: {
              academicUnitId,
              year: previousYear,
            },
          },
        })
      }
    )

    const previousBudgets = (await Promise.all(previousBudgetPromises)).filter(
      Boolean
    )
    const previousSum = previousBudgets
      .map((b) => b!.amountIndex)
      .filter(Boolean)
      .reduce((acc, item) => {
        if (!item) return acc
        if (!acc || (!acc.FCA && !acc.FMR)) return item
        return sumAmountIndex([acc, item])
      }, ZeroAmountIndex)

    // Calculate delta as percentage change from previous year
    const delta =
      previousSum && (previousSum.FCA > 0 || previousSum.FMR > 0) ?
        {
          FCA:
            ((sumAcademicUnitBudget.FCA - previousSum.FCA) / previousSum.FCA) *
            100,
          FMR:
            ((sumAcademicUnitBudget.FMR - previousSum.FMR) / previousSum.FMR) *
            100,
        }
      : ZeroAmountIndex

    return {
      value: sumAcademicUnitBudget,
      delta,
    }
  } catch (error) {
    console.error('Error fetching academic unit budget summary:', error)
    return {
      value: ZeroAmountIndex,
      delta: ZeroAmountIndex,
    }
  }
}

// TODO: This function uses JSON.stringify for deduplication which is inefficient and unreliable
// Consider using a more efficient approach like creating a proper key based on specific properties
// or using a Set with a proper comparison function
const removeDuplicates = <T extends AnualBudget>(inputArray: T[]) => {
  const uniqueArray: T[] = []
  const seenItems = new Set()

  for (const item of inputArray) {
    // Use budget ID as the key for deduplication since budgetItems are now a relation
    const key = item.id

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

  // Cast to the correct type that includes all relations needed for calculations
  const anualBudgets = removeDuplicates(
    list as (AnualBudget & {
      budgetTeamMembers: AnualBudgetTeamMemberWithAllRelations[]
    })[]
  ).filter((ab) => ab.state !== AnualBudgetState.REJECTED)

  // This summary is related to protocols budgets - NOW FILTERED BY YEAR
  const protocolBudgetSummary = await calculateTotalBudgetAggregated(
    anualBudgets,
    academicUnitId,
    year // Pass the year parameter to filter by selected year
  )

  // This summary is related to academic unit budgets - extract IDs and call async function
  const academicUnitIds = academicUnits.map((ac) => ac.id)
  const academicUnitBudgetSummary = await getAcademicUnitBudgetSummary(
    academicUnitIds,
    year
  )

  // Projected budget summaries - now filtered by year
  // MAIN: Total projected consumption (pending + approved) - what admin needs to see
  const projectedBudgetSummary = {
    value: sumAmountIndex([
      protocolBudgetSummary.totalPeding,
      protocolBudgetSummary.totalApproved,
    ]),
  }

  // BREAKDOWN: Individual components for detailed view
  const projectedBudgetSummaryPending = {
    value: protocolBudgetSummary.totalPeding,
  }

  const projectedBudgetSummaryApproved = {
    value: protocolBudgetSummary.totalApproved,
  }

  // Convert actual spent amount back to AmountIndex for UI consistency
  const totalActualSpent =
    protocolBudgetSummary.ABIeActual + protocolBudgetSummary.ABTeActual
  const indexes = await getCurrentIndexes()
  const { currentFCA, currentFMR } = indexes

  const spentBudgetForDisplay: AmountIndex = {
    FCA: totalActualSpent / currentFCA,
    FMR: totalActualSpent / currentFMR,
  }

  const result = {
    academicUnitBudgetSummary,
    projectedBudgetSummary, // NOW: Total projected consumption (pending + approved)
    projectedBudgetSummaryPending, // BREAKDOWN: Only pending budgets
    projectedBudgetSummaryApproved, // BREAKDOWN: Only approved budgets
    spentBudget: spentBudgetForDisplay, // AmountIndex based on actual amounts converted at current rates
    // Keep the actual amount for reference
    spentBudgetActual: totalActualSpent,
  }

  // DEBUG: Log all budget summary values for debugging
  console.log(
    '🔍 DEBUG - Budget Summary for year:',
    year,
    academicUnitId ?
      `(Academic Unit: ${academicUnitId})`
    : '(All Academic Units)'
  )
  console.log(
    '📊 academicUnitBudgetSummary.value:',
    academicUnitBudgetSummary.value
  )
  console.log(
    '📊 projectedBudgetSummary.value (TOTAL - pending + approved):',
    projectedBudgetSummary.value
  )
  console.log(
    '📊 projectedBudgetSummaryPending.value:',
    projectedBudgetSummaryPending.value
  )
  console.log(
    '📊 projectedBudgetSummaryApproved.value:',
    projectedBudgetSummaryApproved.value
  )
  console.log(
    '📊 spentBudget (converted to AmountIndex for display):',
    result.spentBudget
  )
  console.log(
    '📊 spentBudgetActual (actual amount spent):',
    result.spentBudgetActual
  )
  console.log('📊 protocolBudgetSummary (raw breakdown):', {
    ABIe: protocolBudgetSummary.ABIe,
    ABTe: protocolBudgetSummary.ABTe,
    ABIr: protocolBudgetSummary.ABIr,
    ABTr: protocolBudgetSummary.ABTr,
    total: protocolBudgetSummary.total,
    totalPeding: protocolBudgetSummary.totalPeding,
    totalApproved: protocolBudgetSummary.totalApproved,
    ABIeActual: protocolBudgetSummary.ABIeActual,
    ABTeActual: protocolBudgetSummary.ABTeActual,
  })

  return result
}

export type BudgetSummaryType = Awaited<ReturnType<typeof getBudgetSummary>>

/**
 * Synchronizes protocol team member changes with annual budget team members for ongoing protocols.
 * This function ensures that when team members are added, removed, or modified in an ongoing protocol,
 * the corresponding annual budget allocations are properly updated while preserving execution history.
 *
 * @param protocolId - The ID of the protocol whose team members changed
 * @param year - The year to synchronize (defaults to current year)
 * @returns A Promise that resolves to the synchronization result
 */
export const syncProtocolTeamMembersWithBudget = async (
  protocolId: string,
  year: number = new Date().getFullYear()
) => {
  try {
    console.log(
      `🔄 Starting team member synchronization for protocol ${protocolId}, year ${year}`
    )

    // Get the protocol with current team member assignments
    const protocol = await findProtocolById(protocolId)
    if (!protocol) {
      throw new Error('Protocol not found')
    }

    // Only synchronize for ongoing protocols
    if (protocol.state !== ProtocolState.ON_GOING) {
      console.log(
        `⚠️  Protocol ${protocolId} is not in ON_GOING state. Skipping synchronization.`
      )
      return {
        status: false,
        message: 'Protocol is not in ongoing state',
      }
    }

    // Find the annual budget for the specified year
    const annualBudget = await prisma.anualBudget.findFirst({
      where: {
        protocolId: protocolId,
        year: year,
        state: AnualBudgetState.APPROVED, // Only sync approved budgets
      },
      include: {
        budgetTeamMembers: {
          include: {
            executions: true,
            teamMember: {
              include: {
                categories: { include: { category: true } },
              },
            },
            category: true,
          },
        },
      },
    })

    if (!annualBudget) {
      console.log(
        `⚠️  No approved annual budget found for protocol ${protocolId}, year ${year}`
      )
      return {
        status: false,
        message: 'No approved annual budget found for the specified year',
      }
    }

    const duration = protocolDuration(protocol.sections.duration.duration)

    // Get current active team members from protocol (those without 'to' date in their current assignment)
    const currentProtocolTeam = protocol.sections.identification.team.filter(
      (member) => {
        const activeAssignment = member.assignments?.find((a) => !a.to)
        return !!activeAssignment // Only include members with active assignments
      }
    )

    // Get current budget team members
    const currentBudgetTeam = annualBudget.budgetTeamMembers

    // Create maps for easier comparison
    const protocolTeamMap = new Map(
      currentProtocolTeam.map((member) => [
        member.teamMemberId || `category_${member.categoryToBeConfirmed}`,
        member,
      ])
    )

    const budgetTeamMap = new Map(
      currentBudgetTeam.map((member) => [
        member.teamMemberId || `category_${member.categoryId}`,
        member,
      ])
    )

    const operations = {
      toAdd: [] as typeof currentProtocolTeam,
      toRemove: [] as typeof currentBudgetTeam,
      toUpdate: [] as {
        protocol: (typeof currentProtocolTeam)[0]
        budget: (typeof currentBudgetTeam)[0]
      }[],
    }

    // Find team members to add (in protocol but not in budget)
    for (const [key, protocolMember] of protocolTeamMap) {
      if (!budgetTeamMap.has(key)) {
        operations.toAdd.push(protocolMember)
      } else {
        const budgetMember = budgetTeamMap.get(key)!
        // Check if update is needed (role or hours changed)
        const activeAssignment = protocolMember.assignments?.find((a) => !a.to)
        if (
          activeAssignment &&
          (budgetMember.memberRole !== protocolMember.role ||
            Math.abs(
              budgetMember.hours -
                calculateMemberHours(protocolMember, duration)
            ) > 0.1)
        ) {
          operations.toUpdate.push({
            protocol: protocolMember,
            budget: budgetMember,
          })
        }
      }
    }

    // Find team members to remove (in budget but not in current protocol team)
    for (const [key, budgetMember] of budgetTeamMap) {
      if (!protocolTeamMap.has(key)) {
        operations.toRemove.push(budgetMember)
      }
    }

    console.log(`📊 Synchronization operations:`, {
      toAdd: operations.toAdd.length,
      toRemove: operations.toRemove.length,
      toUpdate: operations.toUpdate.length,
    })

    // Execute operations in a transaction
    await prisma.$transaction(async (tx) => {
      // 1. Handle removed team members - preserve executions, zero remaining hours
      for (const memberToRemove of operations.toRemove) {
        console.log(
          `➖ Deactivating budget team member: ${memberToRemove.memberRole}`
        )

        await tx.anualBudgetTeamMember.update({
          where: { id: memberToRemove.id },
          data: {
            hours: memberToRemove.hours - memberToRemove.remainingHours, // Keep only executed hours
            remainingHours: 0, // Zero out remaining hours
          },
        })
      }

      // 2. Handle added team members - create new budget allocations
      for (const memberToAdd of operations.toAdd) {
        console.log(`➕ Adding new budget team member: ${memberToAdd.role}`)

        const totalHours = calculateMemberHours(memberToAdd, duration)

        // Calculate hours for remaining time in the year
        const currentDate = new Date()
        const yearStart = new Date(year, 0, 1)
        const yearEnd = new Date(year, 11, 31)
        const monthsRemaining = Math.max(
          1,
          Math.ceil(
            (yearEnd.getTime() - currentDate.getTime()) /
              (1000 * 60 * 60 * 24 * 30)
          )
        )
        const proportionalHours = Math.ceil((totalHours * monthsRemaining) / 12)

        const newBudgetTeamMember = {
          anualBudgetId: annualBudget.id,
          teamMemberId: memberToAdd.teamMemberId || null,
          categoryId: memberToAdd.categoryToBeConfirmed || null,
          memberRole: memberToAdd.role,
          hours: proportionalHours,
          remainingHours: proportionalHours,
        }

        await tx.anualBudgetTeamMember.create({
          data: newBudgetTeamMember,
        })
      }

      // 3. Handle updated team members - update role/hours while preserving executions
      for (const {
        protocol: protocolMember,
        budget: budgetMember,
      } of operations.toUpdate) {
        console.log(`🔄 Updating budget team member: ${protocolMember.role}`)

        const newTotalHours = calculateMemberHours(protocolMember, duration)
        const executedHours = budgetMember.hours - budgetMember.remainingHours
        const newRemainingHours = Math.max(0, newTotalHours - executedHours)

        await tx.anualBudgetTeamMember.update({
          where: { id: budgetMember.id },
          data: {
            memberRole: protocolMember.role,
            hours: newTotalHours,
            remainingHours: newRemainingHours,
            // Update category if it changed (for toBeConfirmed members)
            categoryId:
              protocolMember.categoryToBeConfirmed || budgetMember.categoryId,
          },
        })
      }
    })

    console.log(
      `✅ Team member synchronization completed for protocol ${protocolId}`
    )

    return {
      status: true,
      message: 'Team members synchronized successfully',
      operations: {
        added: operations.toAdd.length,
        removed: operations.toRemove.length,
        updated: operations.toUpdate.length,
      },
    }
  } catch (error) {
    console.error('❌ Error synchronizing team members with budget:', error)
    return {
      status: false,
      message: 'Error during synchronization',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Helper function to calculate total hours for a team member based on protocol duration
 */
const calculateMemberHours = (
  member: ProtocolSectionsIdentificationTeam,
  duration: number
): number => {
  const activeAssignment = member.assignments?.find((a) => !a.to)
  const hoursAssigned = activeAssignment?.hours ?? 1

  return Math.max(
    1,
    Math.ceil(
      member.workingMonths && member.workingMonths > 0 ?
        hoursAssigned * member.workingMonths * WEEKS_IN_MONTH
      : hoursAssigned * duration
    )
  )
}

/**
 * Administrative utility function to synchronize all ongoing protocols with their budgets.
 * This function is useful for ensuring data consistency across all ongoing protocols.
 * Should be called manually by administrators when needed.
 *
 * @param year - The year to synchronize (defaults to current year)
 * @returns A Promise that resolves to the synchronization results for all protocols
 */
export const syncAllOngoingProtocolsWithBudgets = async (
  year: number = new Date().getFullYear()
) => {
  try {
    console.log(
      `🔄 Starting bulk synchronization for all ongoing protocols, year ${year}`
    )

    // Get all ongoing protocols
    const ongoingProtocols = await prisma.protocol.findMany({
      where: {
        state: ProtocolState.ON_GOING,
      },
      select: {
        id: true,
        sections: {
          select: {
            identification: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    })

    console.log(
      `📊 Found ${ongoingProtocols.length} ongoing protocols to synchronize`
    )

    const results = []
    let successCount = 0
    let failureCount = 0

    // Process each protocol
    for (const protocol of ongoingProtocols) {
      try {
        console.log(
          `🔄 Synchronizing protocol ${protocol.id}: ${protocol.sections.identification.title}`
        )

        const syncResult = await syncProtocolTeamMembersWithBudget(
          protocol.id,
          year
        )

        results.push({
          protocolId: protocol.id,
          title: protocol.sections.identification.title,
          ...syncResult,
        })

        if (syncResult.status) {
          successCount++
        } else {
          failureCount++
        }
      } catch (error) {
        console.error(`❌ Error synchronizing protocol ${protocol.id}:`, error)
        results.push({
          protocolId: protocol.id,
          title: protocol.sections.identification.title,
          status: false,
          message: error instanceof Error ? error.message : 'Unknown error',
        })
        failureCount++
      }
    }

    console.log(
      `✅ Bulk synchronization completed. Success: ${successCount}, Failures: ${failureCount}`
    )

    return {
      status: true,
      message: `Bulk synchronization completed`,
      summary: {
        total: ongoingProtocols.length,
        successful: successCount,
        failed: failureCount,
      },
      results,
    }
  } catch (error) {
    console.error('❌ Error during bulk synchronization:', error)
    return {
      status: false,
      message: 'Error during bulk synchronization',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

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


