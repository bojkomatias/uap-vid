import type {
  AmountIndex,
  AnualBudget,
  Execution,
  TeamMemberCategory,
} from '@prisma/client'
import { Prisma } from '@prisma/client'
import { type AnualBudgetItem } from '@prisma/client'
import {
  multiplyAmountIndex,
  subtractAmountIndex,
  sumAmountIndex,
  ZeroAmountIndex,
} from '@utils/amountIndex'
import { getCurrentIndexes } from '@repositories/finance-index'

// Utils for calculating the total budget or intermediate values once the annual budget is created.
// I must create a type using the Prisma validator to mantain consistency if
//the schema changes and also use the relations in the utils methods
const anualBudgetTeamMemberWithAllRelations =
  Prisma.validator<Prisma.AnualBudgetTeamMemberDefaultArgs>()({
    include: {
      teamMember: {
        include: {
          categories: { include: { category: true } },
        },
      },
      category: true,
      executions: true,
    },
  })

export type AnualBudgetTeamMemberWithAllRelations =
  Prisma.AnualBudgetTeamMemberGetPayload<
    typeof anualBudgetTeamMemberWithAllRelations
  >

const anualBudgetItemWithExecutions =
  Prisma.validator<Prisma.AnualBudgetItemDefaultArgs>()({
    include: {
      executions: true,
    },
  })

export type AnualBudgetItemWithExecutions = Prisma.AnualBudgetItemGetPayload<
  typeof anualBudgetItemWithExecutions
>

// Type for historic team member category with all relations
const historicTeamMemberCategoryWithAllRelations =
  Prisma.validator<Prisma.HistoricTeamMemberCategoryDefaultArgs>()({
    include: {
      category: true,
    },
  })

export type HistoricTeamMemberCategoryWithAllRelations =
  Prisma.HistoricTeamMemberCategoryGetPayload<
    typeof historicTeamMemberCategoryWithAllRelations
  >

// New function to get actual amounts spent (not affected by index changes)
const totalExecutionActualAmount = (
  ex: Execution[],
  academicUnitId?: string
): number => {
  if (academicUnitId) {
    return ex
      .filter((e) => e.academicUnitId === academicUnitId)
      .filter((e) => e.amount !== null && e.amount !== undefined)
      .reduce((acc, item) => {
        return acc + (item.amount ?? 0)
      }, 0)
  } else {
    return ex.reduce((acc, item) => {
      return acc + (item.amount ?? 0)
    }, 0)
  }
}

const totalExecution = async (
  ex: Execution[],
  academicUnitId?: string
): Promise<AmountIndex> => {
  // Get current exchange rates
  const indexes = await getCurrentIndexes()
  const { currentFCA, currentFMR } = indexes

  const totalAmount = totalExecutionActualAmount(ex, academicUnitId)

  // Convert total amount to AmountIndex using current exchange rates
  return {
    FCA: totalAmount / currentFCA,
    FMR: totalAmount / currentFMR,
  } as AmountIndex
}

const calculateRemainingABI = async (
  abi: AnualBudgetItemWithExecutions[],
  amountAcademicUnits: number,
  executionPerAcademicUnit?: AmountIndex
): Promise<AmountIndex> => {
  const totalBudgetItemsAmount = abi.reduce(
    (acc, item) => {
      acc.FCA +=
        executionPerAcademicUnit ?
          item.amountIndex.FCA / amountAcademicUnits
        : item.amountIndex.FCA
      acc.FMR +=
        executionPerAcademicUnit ?
          item.amountIndex.FMR / amountAcademicUnits
        : item.amountIndex.FMR
      return acc
    },
    { FCA: 0, FMR: 0 } as AmountIndex
  )
  const amountPerAcademicUnit: AmountIndex = {
    FCA: totalBudgetItemsAmount.FCA / amountAcademicUnits,
    FMR: totalBudgetItemsAmount.FMR / amountAcademicUnits,
  }

  if (executionPerAcademicUnit) {
    return {
      FCA: amountPerAcademicUnit.FCA - executionPerAcademicUnit.FCA,
      FMR: amountPerAcademicUnit.FMR - executionPerAcademicUnit.FMR,
    }
  }

  const totalExecutionAmountPromises = abi.map(
    async (bi) => await totalExecution(bi.executions)
  )
  const totalExecutionAmounts = await Promise.all(totalExecutionAmountPromises)

  const totalExecutionAmount = totalExecutionAmounts.reduce(
    (acc, totalEx) => {
      acc = sumAmountIndex([acc, totalEx])
      return acc
    },
    { FCA: 0, FMR: 0 } as AmountIndex
  )

  return subtractAmountIndex(totalBudgetItemsAmount, totalExecutionAmount)
}

const calculateRemainingABTM = (
  abtm: AnualBudgetTeamMemberWithAllRelations[],
  academicUnitId?: string
): AmountIndex => {
  //This part is used to calculate the remaining budget for a specific academic unit in summary cards
  const calculateRemaining = (
    abtm: AnualBudgetTeamMemberWithAllRelations[]
  ) => {
    if (!abtm) return { FCA: 0, FMR: 0 } as AmountIndex

    const ABTMcategory = abtm
      .filter((item) => item.categoryId)
      .reduce(
        (acc, item) => {
          const remainingIndex = multiplyAmountIndex(
            item.category!.amountIndex,
            item.remainingHours
          )
          acc = sumAmountIndex([acc, remainingIndex])
          return acc
        },
        { FCA: 0, FMR: 0 } as AmountIndex
      )
    // SORETE
    const ABTMteamMember = abtm
      .filter((item) => item.teamMemberId && !item.categoryId)
      .reduce(
        (acc, item) => {
          const remainingIndex = multiplyAmountIndex(
            getLastCategoryPriceIndex(item),
            item.remainingHours
          )
          acc = sumAmountIndex([acc, remainingIndex])
          return acc
        },
        { FCA: 0, FMR: 0 } as AmountIndex
      )

    const total = sumAmountIndex([ABTMcategory, ABTMteamMember])
    return total
  }
  if (academicUnitId) {
    const abtmAcademicUnit = abtm.filter(
      (item) =>
        item.teamMember && item.teamMember.academicUnitId === academicUnitId
    )
    return calculateRemaining(abtmAcademicUnit)
  }

  return calculateRemaining(abtm)
}

const getLastCategoryPriceIndex = (
  abtm: AnualBudgetTeamMemberWithAllRelations
): AmountIndex => {
  if (!abtm.teamMember) return { FCA: 0, FMR: 0 } as AmountIndex
  const category = abtm.teamMember.categories.find((c) => !c.to)
  if (!category) return { FCA: 0, FMR: 0 } as AmountIndex
  return calculateHourRateGivenTMCategory(category)
}

export const calculateHourRateGivenTMCategory = (
  category: HistoricTeamMemberCategoryWithAllRelations | null
): AmountIndex => {
  if (!category) return { FCA: 0, FMR: 0 } as AmountIndex
  const isObrero = Boolean(category.pointsObrero)
  const categoryPrice =
    category.category.amountIndex ?? ({ FCA: 0, FMR: 0 } as AmountIndex)

  const calculateObreroHourlyRate = (
    categoryPrice: AmountIndex,
    pointsObrero: number
  ) => {
    return {
      FCA: (pointsObrero * categoryPrice.FCA) / 176,
      FMR: (pointsObrero * categoryPrice.FMR) / 176,
    }
  }

  const hourRate =
    isObrero ?
      calculateObreroHourlyRate(categoryPrice, category.pointsObrero ?? 0)
    : categoryPrice

  return hourRate
}

export const calculateHourRateGivenCategory = (
  category: TeamMemberCategory | null
): AmountIndex => {
  if (!category) return { FCA: 0, FMR: 0 } as AmountIndex
  const hourRate = category.amountIndex ?? ({ FCA: 0, FMR: 0 } as AmountIndex)

  return hourRate
}

export const calculateTotalBudget = async (
  anualBudget: AnualBudget & {
    budgetItems?: AnualBudgetItemWithExecutions[]
    budgetTeamMembers: AnualBudgetTeamMemberWithAllRelations[]
  },
  academicUnitId?: string
) => {
  const amountAcademicUnits = anualBudget.academicUnitsIds.length

  // Handle the case where budgetItems might not be included
  const budgetItems = anualBudget.budgetItems || []

  //Executions - AmountIndex versions (for compatibility)
  const ABIe = await totalExecution(
    budgetItems.map((item) => item.executions || []).flat(),
    academicUnitId
  )
  const ABTe = await totalExecution(
    academicUnitId ?
      anualBudget.budgetTeamMembers
        .filter((tm) => tm.teamMember?.academicUnitId === academicUnitId)
        .map((item) => item.executions || [])
        .flat()
    : anualBudget.budgetTeamMembers.map((item) => item.executions || []).flat()
  )

  // Executions - Actual amounts (not affected by index changes)
  const ABIeActual = totalExecutionActualAmount(
    budgetItems.map((item) => item.executions || []).flat(),
    academicUnitId
  )
  const ABTeActual = totalExecutionActualAmount(
    academicUnitId ?
      anualBudget.budgetTeamMembers
        .filter((tm) => tm.teamMember?.academicUnitId === academicUnitId)
        .map((item) => item.executions || [])
        .flat()
    : anualBudget.budgetTeamMembers.map((item) => item.executions || []).flat()
  )

  //Remainings
  const ABIr = await calculateRemainingABI(
    budgetItems,
    amountAcademicUnits,
    academicUnitId ? ABIe : undefined
  )
  const ABTr = calculateRemainingABTM(
    anualBudget.budgetTeamMembers,
    academicUnitId
  )

  // Calculate total from original budget amounts, not executed + remaining
  // This ensures consistency for reactivated budgets
  const totalBudgetItems = budgetItems.reduce(
    (acc, item) => {
      const itemAmount =
        academicUnitId ?
          {
            FCA: item.amountIndex.FCA / amountAcademicUnits,
            FMR: item.amountIndex.FMR / amountAcademicUnits,
          }
        : item.amountIndex
      return sumAmountIndex([acc, itemAmount])
    },
    { FCA: 0, FMR: 0 } as AmountIndex
  )

  const totalTeamMembers = anualBudget.budgetTeamMembers
    .filter((tm) =>
      academicUnitId ? tm.teamMember?.academicUnitId === academicUnitId : true
    )
    .reduce(
      (acc, tm) => {
        const memberTotal =
          tm.teamMemberId ?
            multiplyAmountIndex(getLastCategoryPriceIndex(tm), tm.hours)
          : multiplyAmountIndex(
              tm.category?.amountIndex ?? ZeroAmountIndex,
              tm.hours
            )
        return sumAmountIndex([acc, memberTotal])
      },
      { FCA: 0, FMR: 0 } as AmountIndex
    )

  const total = sumAmountIndex([totalBudgetItems, totalTeamMembers])

  return {
    ABIe,
    ABTe,
    ABIr,
    ABTr,
    total,
    // New fields for actual amounts spent
    ABIeActual,
    ABTeActual,
  }
}

export const calculateTotalBudgetAggregated = async (
  anualBudgets: (AnualBudget & {
    budgetTeamMembers: AnualBudgetTeamMemberWithAllRelations[]
  })[],
  academicUnitId?: string,
  year?: number
) => {
  // Default to current year if no year provided
  const currentYear = year ?? new Date().getFullYear()

  // Filter budgets by year
  const filteredBudgets = anualBudgets.filter(
    (anualBudget) => anualBudget.year === currentYear
  )

  const pendingBudgets = filteredBudgets.filter(
    (anualBudget) => anualBudget.state === 'PENDING'
  )
  const pendingPromises = pendingBudgets.map((anualBudget) =>
    calculateTotalBudget(anualBudget, academicUnitId)
  )
  const pendingResults = await Promise.all(pendingPromises)

  const totalPending = pendingResults.reduce(
    (acc, item) => {
      acc.totalPeding = sumAmountIndex([acc.totalPeding, item.total])
      return acc
    },
    { totalPeding: { FCA: 0, FMR: 0 } as AmountIndex }
  )

  const approvedBudgets = filteredBudgets.filter(
    (anualBudget) => anualBudget.state === 'APPROVED'
  )
  const approvedPromises = approvedBudgets.map((anualBudget) =>
    calculateTotalBudget(anualBudget, academicUnitId)
  )
  const approvedResults = await Promise.all(approvedPromises)

  const totalApproved = approvedResults.reduce(
    (acc, item) => {
      acc.totalApproved = sumAmountIndex([acc.totalApproved, item.total])
      return acc
    },
    { totalApproved: { FCA: 0, FMR: 0 } as AmountIndex }
  )

  const allPromises = filteredBudgets.map((anualBudget) =>
    calculateTotalBudget(anualBudget, academicUnitId)
  )
  const allResults = await Promise.all(allPromises)

  const result = allResults.reduce(
    (acc, item) => {
      acc.ABIe = sumAmountIndex([acc.ABIe, item.ABIe])
      acc.ABTe = sumAmountIndex([acc.ABTe, item.ABTe])
      acc.ABIr = sumAmountIndex([acc.ABIr, item.ABIr])
      acc.ABTr = sumAmountIndex([acc.ABTr, item.ABTr])
      acc.total = sumAmountIndex([acc.total, item.total])
      // Aggregate actual amounts spent
      acc.ABIeActual += item.ABIeActual
      acc.ABTeActual += item.ABTeActual
      return acc
    },
    {
      ABIe: { FCA: 0, FMR: 0 } as AmountIndex,
      ABTe: { FCA: 0, FMR: 0 } as AmountIndex,
      ABIr: { FCA: 0, FMR: 0 } as AmountIndex,
      ABTr: { FCA: 0, FMR: 0 } as AmountIndex,
      total: { FCA: 0, FMR: 0 } as AmountIndex,
      // New fields for actual amounts spent
      ABIeActual: 0,
      ABTeActual: 0,
    }
  )
  return { ...result, ...totalPending, ...totalApproved }
}

export type TotalBudgetCalculation = Awaited<
  ReturnType<typeof calculateTotalBudget>
>
export enum ExecutionType {
  TeamMember,
  Item,
}
