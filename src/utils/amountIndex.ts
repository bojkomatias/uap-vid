import type { AmountIndex } from '@prisma/client'

export const sumAmountIndex = (indexes: AmountIndex[]): AmountIndex => {
  return indexes.reduce((acc, item) => {
    acc.FCA += item.FCA
    acc.FMR += item.FMR
    return acc
  }, {} as AmountIndex)
}

export const multiplyAmountIndex = (
  amountIndex: AmountIndex,
  multiplier: number
) => {
  return {
    FCA: amountIndex.FCA * multiplier,
    FMR: amountIndex.FMR * multiplier,
  }
}

export const divideAmountIndex = (
  amountIndex: AmountIndex,
  divisor: number
) => {
  return {
    FCA: amountIndex.FCA / divisor,
    FMR: amountIndex.FMR / divisor,
  }
}

export const subtractAmountIndex = (
  amountIndex: AmountIndex,
  subtrahend: AmountIndex
) => {
  return {
    FCA: amountIndex.FCA - subtrahend.FCA,
    FMR: amountIndex.FMR - subtrahend.FMR,
  }
}

export const ZeroAmountIndex = {
  FCA: 0,
  FMR: 0,
} as AmountIndex
