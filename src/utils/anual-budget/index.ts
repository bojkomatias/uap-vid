import type { AnualBudget, Execution } from '@prisma/client'
import { Prisma } from '@prisma/client'
import { type AnualBudgetItem } from '@prisma/client'

// Utils for calculating the total budget or intermediate values once the annual budget is created.
// I must create a type using the Prisma validator to mantain consistency if
//the schema changes and also use the relations in the utils methods
const anualBudgetTeamMemberWithAllRelations =
    Prisma.validator<Prisma.AnualBudgetTeamMemberDefaultArgs>()({
        include: {
            teamMember: {
                include: { categories: { include: { category: true } } },
            },
        },
    })

export type AnualBudgetTeamMemberWithAllRelations =
    Prisma.AnualBudgetTeamMemberGetPayload<
        typeof anualBudgetTeamMemberWithAllRelations
    >

const totalExecution = (ex: Execution[], academicUnitId?: string): number => {
    if (academicUnitId) {
        const executionAmountPerAcademicUnit = ex
            .filter((e) => e.academicUnitId === academicUnitId)
            .reduce((acc, item) => {
                acc += item.amount
                return acc
            }, 0)
        return executionAmountPerAcademicUnit
    }
    return ex.reduce((acc, item) => {
        acc += item.amount
        return acc
    }, 0)
}

const calculateRemainingABI = (
    abi: AnualBudgetItem[],
    amountAcademicUnits: number,
    executionPerAcademicUnit?: number
): number => {
    const totalBudgetItemsAmount = abi.reduce((acc, item) => {
        acc += executionPerAcademicUnit ? item.amount / amountAcademicUnits : item.amount
        return acc
    }, 0)
    const amountPerAcademicUnit = totalBudgetItemsAmount / amountAcademicUnits

    if (executionPerAcademicUnit) {
        return amountPerAcademicUnit - executionPerAcademicUnit
    }

    const totalExecutionAmount = abi
        .map((bi) => bi.executions)
        .reduce((acc, item) => {
            acc += totalExecution(item)
            return acc
        }, 0)

    return totalBudgetItemsAmount - totalExecutionAmount
}

const calculateRemainingABTM = (
    abtm: AnualBudgetTeamMemberWithAllRelations[],
    academicUnitId?: string
): number => {
    //This part is used to calculate the remaining budget for a specific academic unit in summary cards
    if (academicUnitId) {
        const abtmAcademicUnit = abtm.filter(
            (item) => item.teamMember.academicUnitId === academicUnitId
        )
        return abtmAcademicUnit
            ? abtmAcademicUnit.reduce((acc, item) => {
                  acc += item.remainingHours * getLastCategoryPrice(item)
                  return acc
              }, 0)
            : 0
    }

    return abtm
        ? abtm.reduce((acc, item) => {
              acc += item.remainingHours * getLastCategoryPrice(item)
              return acc
          }, 0)
        : 0
}

const getLastCategoryPrice = (abtm: AnualBudgetTeamMemberWithAllRelations) => {
    const category = abtm.teamMember.categories.find((c) => !c.to)
    if (!category) return 0
    const lastPrice = category.category.price.find((p) => !p.to)
    return lastPrice?.price || 0
}

export const calculateTotalBudget = (
    anualBudget: AnualBudget & {
        budgetTeamMembers: AnualBudgetTeamMemberWithAllRelations[]
    },
    academicUnitId?: string
) => {
    const amountAcademicUnits = anualBudget.academicUnitsIds.length
    //Executions
    const ABIe = totalExecution(
        anualBudget.budgetItems.map((item) => item.executions).flat(),
        academicUnitId
    )
    const ABTe = totalExecution(
        academicUnitId
            ? anualBudget.budgetTeamMembers
                  .filter(
                      (tm) => tm.teamMember.academicUnitId === academicUnitId
                  )
                  .map((item) => item.executions)
                  .flat()
            : anualBudget.budgetTeamMembers
                  .map((item) => item.executions)
                  .flat()
    )

    //Remainings
    const ABIr = calculateRemainingABI(
        anualBudget.budgetItems,
        amountAcademicUnits,
        academicUnitId ? ABIe : undefined
    )
    const ABTr = calculateRemainingABTM(
        anualBudget.budgetTeamMembers,
        academicUnitId
    )
    console.log('academicUnitId', academicUnitId);
    
    console.log('ABTr', ABTr)

    return {
        ABIe,
        ABTe,
        ABIr,
        ABTr,
        total: ABIe + ABTe + ABIr + ABTr,
    }
}

export const calculateTotalBudgetAggregated = (
    anualBudgets: (AnualBudget & {
        budgetTeamMembers: AnualBudgetTeamMemberWithAllRelations[]
    })[],
    academicUnitId?: string
) => {
    const result = anualBudgets
        .map((anualBudget) => calculateTotalBudget(anualBudget, academicUnitId))
        .reduce(
            (acc, item) => {
                acc.ABIe += item.ABIe
                acc.ABTe += item.ABTe
                acc.ABIr += item.ABIr
                acc.ABTr += item.ABTr
                acc.total += item.total
                return acc
            },
            {
                ABIe: 0,
                ABTe: 0,
                ABIr: 0,
                ABTr: 0,
                total: 0,
            }
        )
    return result
}

export type TotalBudgetCalculation = ReturnType<typeof calculateTotalBudget>
export enum ExecutionType {
    TeamMember,
    Item,
}
