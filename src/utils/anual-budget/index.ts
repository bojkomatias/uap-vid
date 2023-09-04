import type {
  AnualBudget,
    AnualBudgetTeamMember,
    Execution,
    ProtocolSectionsBudget,
    ProtocolSectionsIdentificationTeam,
} from '@prisma/client'
import { type AnualBudgetItem } from '@prisma/client'
import { generateAnualBudgetExecutions } from '@repositories/anual-budget'
import { findProtocolById } from '@repositories/protocol'
import {
    getTeamMemberCategoriesById,
} from '@repositories/team-member'

type AnualBudgetItemWithoutExecutions = Omit<AnualBudgetItem, 'executions'>
const generateAnualBudgetItems = (
    protocolBudgetSection: ProtocolSectionsBudget,
    year: string
): AnualBudgetItemWithoutExecutions[] => {
    return protocolBudgetSection.expenses.reduce((acc, item) => {
        const budgetItems = item.data
            .filter((d) => d.year === year)
            .map((d) => {
                return {
                    type: item.type,
                    amount: d.amount,
                    detail: d.detail,
                    remaining: d.amount
                }
            })
        acc.push(...budgetItems)
        return acc
    }, [] as AnualBudgetItemWithoutExecutions[])
}

type AnualBudgetTeamMemberItemWithoutExecutions = Omit<
    AnualBudgetTeamMember,
    'executions'
>
const generateAnualBudgetTeamMembersItems = (
    protocolTeam: ProtocolSectionsIdentificationTeam[]
): AnualBudgetTeamMemberItemWithoutExecutions[] => {
    return protocolTeam.map((item) => {
        return {
            teamMemberId: item.teamMemberId,
            hours: item.hours,
            remainingHours: item.hours,
        } as AnualBudgetTeamMemberItemWithoutExecutions
    })
}

const totalExcecution = (ex: Execution[]): number => {
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
    abtm: AnualBudgetTeamMember[],
    calculationType: RemainingTypeCalculation
): Promise<number> => {
    const { categories } = await getTeamMemberCategoriesByIds(abtm) // Could be improved querying only the categories needed
    return abtm.reduce((acc, item) => {
        const category = categories.find(
            (tm) => tm.id === item.teamMemberId
        )?.category
        if (category) {
            const lastPrice = getPriceByCalculationType(category.price, calculationType)
            acc += item.remainingHours * lastPrice
        }
        return acc
    }, 0)
}

const getPriceByCalculationType = (
    prices: {
        from: Date
        to: Date | null
        price: number
        currency: string
    }[],
    calculationType:RemainingTypeCalculation = RemainingTypeCalculation.Current
) => {
  if (!prices || prices.length === 0) return 0
    switch (calculationType) {
        case RemainingTypeCalculation.Last:
          return prices[prices.length - 1]
        case RemainingTypeCalculation.Current:
          return prices.find((p) => !p.to)
        case RemainingTypeCalculation.Moment:
          return prices.find((p) => p.from <= new Date() && (!p.to || p.to >= new Date()))
        default:
          return prices[prices.length - 1]
    }
}

const getTeamMemberCategoriesByIds = (abtm: AnualBudgetTeamMember[]) => {
    const ids = abtm.map((item) => item.teamMemberId)
    return getTeamMemberCategoriesById(ids)
}

enum RemainingTypeCalculation {
  Last,
  Current,
  Moment
}

const calculateTotalBudget = async (anualBudget : AnualBudget, calculationType: RemainingTypeCalculation) => {
  const ABIe = totalExcecution(anualBudget.budgetItems.map(item => item.executions).flat())
  const ABTe = totalExcecution(anualBudget.budgetTeamMembers.map(item => item.executions).flat())

  const ABIr = calculateRemainingABI(anualBudget.budgetItems)
  const ABTr = await calculateRemainingABTM(anualBudget.budgetTeamMembers, calculationType) //Here we can pass the attribute to choose the last price, current price or price at the moment of the execution

  return {
    ABIe,
    ABTe,
    ABIr,
    ABTr,
    total: ABIe + ABTe + ABIr + ABTr
}
}

export const generateAnualBudget = async (protocolId:string, year:string) => {
    const protocol = await findProtocolById(protocolId)
    if (!protocol) return null
    const ABI = generateAnualBudgetItems(protocol?.sections.budget, year)
    const ABT = generateAnualBudgetTeamMembersItems(protocol.sections.identification.team)

    await generateAnualBudgetExecutions(protocolId, ABI, ABT, year)
}




