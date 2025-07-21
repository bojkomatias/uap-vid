import type { AmountIndex, Execution, TeamMemberCategory } from '@prisma/client'
import { Prisma } from '@prisma/client'
import {
  multiplyAmountIndex,
  subtractAmountIndex,
  sumAmountIndex,
} from '@utils/amountIndex'

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
      executions: true, // Now executions are a direct relation
    },
  })

export type AnualBudgetTeamMemberWithAllRelations =
  Prisma.AnualBudgetTeamMemberGetPayload<
    typeof anualBudgetTeamMemberWithAllRelations
  >

const anualBudgetItemWithExecutions =
  Prisma.validator<Prisma.AnualBudgetItemDefaultArgs>()({
    include: {
      executions: true, // Now executions are a direct relation
    },
  })

export type AnualBudgetItemWithExecutions = Prisma.AnualBudgetItemGetPayload<
  typeof anualBudgetItemWithExecutions
>

const anualBudgetWithAllRelations =
  Prisma.validator<Prisma.AnualBudgetDefaultArgs>()({
    include: {
      budgetItems: {
        include: {
          executions: true,
        },
      },
      budgetTeamMembers: {
        include: {
          teamMember: {
            include: {
              categories: { include: { category: true } },
            },
          },
          category: true,
          executions: true,
        },
      },
      executions: true, // Direct executions relation
    },
  })

export type AnualBudgetWithAllRelations = Prisma.AnualBudgetGetPayload<
  typeof anualBudgetWithAllRelations
>

const HistoricTeamMemberCategoryWithAllRelations =
  Prisma.validator<Prisma.HistoricTeamMemberCategoryDefaultArgs>()({
    include: {
      category: true,
    },
  })

export type HistoricTeamMemberCategoryWithAllRelations =
  Prisma.HistoricTeamMemberCategoryGetPayload<
    typeof HistoricTeamMemberCategoryWithAllRelations
  >

const totalExecution = (
  ex: Execution[],
  academicUnitId?: string
): AmountIndex => {
  if (academicUnitId) {
    const executionAmountPerAcademicUnit = ex
      .filter((e) => e.academicUnitId === academicUnitId)
      .filter((e) => e.amountIndex)
      .reduce(
        (acc, item) => {
          acc = sumAmountIndex([
            acc,
            item.amountIndex ?? ({ FCA: 0, FMR: 0 } as AmountIndex),
          ])
          return acc
        },
        { FCA: 0, FMR: 0 } as AmountIndex
      )
    return executionAmountPerAcademicUnit
  }
  return ex.reduce(
    (acc, item) => {
      acc = sumAmountIndex([
        acc,
        item.amountIndex ?? ({ FCA: 0, FMR: 0 } as AmountIndex),
      ])
      return acc
    },
    { FCA: 0, FMR: 0 } as AmountIndex
  )
}

const calculateRemainingABI = (
  abi: AnualBudgetItemWithExecutions[],
  amountAcademicUnits: number,
  executionPerAcademicUnit?: AmountIndex
): AmountIndex => {
  if (!abi || abi.length === 0) {
    return { FCA: 0, FMR: 0 } as AmountIndex
  }

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

  const totalExecutionAmount = abi
    .map((bi) => bi.executions || [])
    .reduce(
      (acc, item) => {
        const totalEx = totalExecution(item)
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

export const calculateTotalBudget = (
  anualBudget: AnualBudgetWithAllRelations,
  academicUnitId?: string
) => {
  const amountAcademicUnits = anualBudget.academicUnitsIds.length

  //Executions - now we can use the direct executions relation or the nested ones
  const ABIe = totalExecution(
    anualBudget.budgetItems?.map((item) => item.executions || []).flat() || [],
    academicUnitId
  )
  const ABTe = totalExecution(
    academicUnitId ?
      (anualBudget.budgetTeamMembers || [])
        .filter((tm) => tm.teamMember?.academicUnitId === academicUnitId)
        .map((item) => item.executions || [])
        .flat()
    : (anualBudget.budgetTeamMembers || [])
        .map((item) => item.executions || [])
        .flat(),
    academicUnitId
  )

  //Remainings
  const ABIr = calculateRemainingABI(
    anualBudget.budgetItems || [],
    amountAcademicUnits,
    academicUnitId ? ABIe : undefined
  )
  const ABTr = calculateRemainingABTM(
    anualBudget.budgetTeamMembers || [],
    academicUnitId
  )

  return {
    ABIe,
    ABTe,
    ABIr,
    ABTr,
    total: sumAmountIndex([ABIe, ABTe, ABIr, ABTr]),
  }
}

export const calculateTotalBudgetAggregated = (
  anualBudgets: AnualBudgetWithAllRelations[],
  academicUnitId?: string
) => {
  const totalPending = anualBudgets
    .filter((anualBudget) => anualBudget.state === 'PENDING')
    .map((anualBudget) => calculateTotalBudget(anualBudget, academicUnitId))
    .reduce(
      (acc, item) => {
        acc.totalPeding = sumAmountIndex([acc.totalPeding, item.total])
        return acc
      },
      { totalPeding: { FCA: 0, FMR: 0 } as AmountIndex }
    )

  const totalApproved = anualBudgets
    .filter((anualBudget) => anualBudget.state === 'APPROVED')
    .map((anualBudget) => calculateTotalBudget(anualBudget, academicUnitId))
    .reduce(
      (acc, item) => {
        acc.totalApproved = sumAmountIndex([acc.totalApproved, item.total])
        return acc
      },
      { totalApproved: { FCA: 0, FMR: 0 } as AmountIndex }
    )

  const result = anualBudgets
    .map((anualBudget) => calculateTotalBudget(anualBudget, academicUnitId))
    .reduce(
      (acc, item) => {
        acc.ABIe = sumAmountIndex([acc.ABIe, item.ABIe])
        acc.ABTe = sumAmountIndex([acc.ABTe, item.ABTe])
        acc.ABIr = sumAmountIndex([acc.ABIr, item.ABIr])
        acc.ABTr = sumAmountIndex([acc.ABTr, item.ABTr])
        acc.total = sumAmountIndex([acc.total, item.total])
        return acc
      },
      {
        ABIe: { FCA: 0, FMR: 0 } as AmountIndex,
        ABTe: { FCA: 0, FMR: 0 } as AmountIndex,
        ABIr: { FCA: 0, FMR: 0 } as AmountIndex,
        ABTr: { FCA: 0, FMR: 0 } as AmountIndex,
        total: { FCA: 0, FMR: 0 } as AmountIndex,
      }
    )
  return { ...result, ...totalPending, ...totalApproved }
}

// Alternative function that uses direct executions relation from AnualBudget
export const calculateTotalBudgetUsingDirectExecutions = (
  anualBudget: AnualBudgetWithAllRelations,
  academicUnitId?: string
) => {
  const amountAcademicUnits = anualBudget.academicUnitsIds.length

  // Filter executions by type and academic unit if needed
  const budgetItemExecutions = (anualBudget.executions || []).filter(
    (ex) => ex.budgetItemId
  )
  const teamMemberExecutions = (anualBudget.executions || []).filter(
    (ex) => ex.teamMemberBudgetId
  )

  //Executions - using direct executions relation
  const ABIe = totalExecution(budgetItemExecutions, academicUnitId)
  const ABTe = totalExecution(teamMemberExecutions, academicUnitId)

  //Remainings - these calculations remain the same
  const ABIr = calculateRemainingABI(
    anualBudget.budgetItems || [],
    amountAcademicUnits,
    academicUnitId ? ABIe : undefined
  )
  const ABTr = calculateRemainingABTM(
    anualBudget.budgetTeamMembers || [],
    academicUnitId
  )

  return {
    ABIe,
    ABTe,
    ABIr,
    ABTr,
    total: sumAmountIndex([ABIe, ABTe, ABIr, ABTr]),
  }
}

export type TotalBudgetCalculation = ReturnType<typeof calculateTotalBudget>
export enum ExecutionType {
  TeamMember,
  Item,
}