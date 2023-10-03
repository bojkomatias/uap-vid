import type { AcademicUnitBudget, AnualBudget, Execution } from '@prisma/client'
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

const totalExecution = (ex: Execution[]): number => {
    return ex ? ex.reduce((acc, item) => {
        acc += item.amount
        return acc
    }, 0) : 0
}

const calculateRemainingABI = (abi: AnualBudgetItem[]): number => {
    return abi ? abi.reduce((acc, item) => {
        acc += item.remaining
        return acc
    }, 0) : 0
}

const calculateRemainingABTM = (
    abtm: AnualBudgetTeamMemberWithAllRelations[]
): number => {
    return abtm ? abtm.reduce((acc, item) => {
        acc += item.remainingHours * getLastCategoryPrice(item)
        return acc
    }, 0) : 0
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
    }
) => {
    //Executions
    const ABIe = totalExecution(
        anualBudget.budgetItems?.map((item) => item.executions).flat()
    )
    const ABTe = totalExecution(
        anualBudget.budgetTeamMembers?.map((item) => item.executions).flat()
    )

    //Remainings
    const ABIr = calculateRemainingABI(anualBudget.budgetItems)
    const ABTr = calculateRemainingABTM(anualBudget.budgetTeamMembers)

    return {
        ABIe,
        ABTe,
        ABIr,
        ABTr,
        total: ABIe + ABTe + ABIr + ABTr,
    }
}

export const calculateTotalBudgetAggregated = (
    anualBudgets: (AnualBudget & {budgetTeamMembers: AnualBudgetTeamMemberWithAllRelations[]})[]
) => {
    const result = anualBudgets
        .map((anualBudget) => calculateTotalBudget(anualBudget))
        .reduce((acc, item) => {
            acc.ABIe += item.ABIe
            acc.ABTe += item.ABTe
            acc.ABIr += item.ABIr
            acc.ABTr += item.ABTr
            acc.total += item.total
            return acc
        }
        , {
            ABIe: 0,
            ABTe: 0,
            ABIr: 0,
            ABTr: 0,
            total: 0,
        })
    return result
}

export type TotalBudgetCalculation = ReturnType<typeof calculateTotalBudget>

