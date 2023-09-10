import type {
    AnualBudget,
    Execution,
} from '@prisma/client'
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
type AnualBudgetTeamMemberWithAllRelations =
    Prisma.AnualBudgetTeamMemberGetPayload<
        typeof anualBudgetTeamMemberWithAllRelations
    >

const totalExecution = (ex: Execution[]): number => {
    return ex.reduce((acc, item) => {
        acc += item.amount
        return acc
    }, 0)
}

const calculateRemainingABI = (abi: AnualBudgetItem[]): number => {
    return abi.reduce((acc, item) => {
        acc += item.remaining
        return acc
    }, 0)
}

const calculateRemainingABTM = async (
    abtm: AnualBudgetTeamMemberWithAllRelations[]
): Promise<number> => {
    return abtm.reduce((acc, item) => {
        acc += item.remainingHours * getLastCategoryPrice(item)
        return acc
    }, 0)
}

const getLastCategoryPrice = (abtm: AnualBudgetTeamMemberWithAllRelations) => {
    const category = abtm.teamMember.categories.find((c) => !c.to)
    if (!category) return 0
    const lastPrice = category.category.price.find((p) => !p.to)
    return lastPrice?.price || 0
}

export const calculateTotalBudget = async (
    anualBudget: AnualBudget & {
        budgetTeamMembers: AnualBudgetTeamMemberWithAllRelations[]
    }
) => {
    //Executions
    const ABIe = totalExecution(
        anualBudget.budgetItems.map((item) => item.executions).flat()
    )
    const ABTe = totalExecution(
        anualBudget.budgetTeamMembers.map((item) => item.executions).flat()
    )

    //Remainings
    const ABIr = calculateRemainingABI(anualBudget.budgetItems)
    const ABTr = await calculateRemainingABTM(anualBudget.budgetTeamMembers)

    return {
        ABIe,
        ABTe,
        ABIr,
        ABTr,
        total: ABIe + ABTe + ABIr + ABTr,
    }
}
