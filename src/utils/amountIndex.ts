import type { AmountIndex } from '@prisma/client'

export const sumAmountIndex = (indexes: AmountIndex[]): AmountIndex => {
  const result = indexes.reduce(
    (acc, item) => {
      acc.FCA += item.FCA ?? 0
      acc.FMR += item.FMR ?? 0

      return acc
    },
    { FCA: 0, FMR: 0 }
  )

  return result
}

export const multiplyAmountIndex = (
  amountIndex: AmountIndex,
  multiplier: number
) => {
  const result = {
    FCA: amountIndex.FCA * multiplier,
    FMR: amountIndex.FMR * multiplier,
  }

  return result
}

export const divideAmountIndex = (
  amountIndex: AmountIndex,
  divisor: number
) => {
  const result = {
    FCA: amountIndex.FCA / divisor,
    FMR: amountIndex.FMR / divisor,
  }

  return result
}

export const divideAmountIndexByAmountIndex = (
  amountIndex: AmountIndex,
  divisor: AmountIndex
) => {
  const result = {
    FCA: amountIndex.FCA / divisor.FCA,
    FMR: amountIndex.FMR / divisor.FMR,
  }

  return result
}

export const subtractAmountIndex = (
  amountIndex: AmountIndex,
  subtrahend: AmountIndex
) => {
  const result = {
    FCA: amountIndex.FCA - subtrahend.FCA,
    FMR: amountIndex.FMR - subtrahend.FMR,
  }

  return result
}

export const ZeroAmountIndex = {
  FCA: 0,
  FMR: 0,
} as AmountIndex

export const BudgetSummaryZero = {
  academicUnitBudgetSummary: {
    value: { FCA: 0, FMR: 0 } as AmountIndex,
    delta: { FCA: 0, FMR: 0 } as AmountIndex,
  },
  projectedBudgetSummary: {
    value: { FCA: 0, FMR: 0 } as AmountIndex,
    delta: { FCA: 0, FMR: 0 } as AmountIndex,
  },
  projectedBudgetSummaryApproved: {
    value: { FCA: 0, FMR: 0 } as AmountIndex,
    delta: { FCA: 0, FMR: 0 } as AmountIndex,
  },
  spentBudget: { FCA: 0, FMR: 0 } as AmountIndex,
}
