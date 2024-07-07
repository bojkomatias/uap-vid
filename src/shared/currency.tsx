'use client'

import { Strong } from '@components/text'
import type { AmountIndex } from '@prisma/client'
import { currencyFormatter } from '@utils/formatters'

type CurrencyProps = { amountIndex?: AmountIndex; amount?: number }

/**
  @amountIndex the indexes values to map and display
  @amount the value to display if value is not indexed
*/
export function Currency({ amountIndex, amount }: CurrencyProps) {
  const currentFCA = 4500
  const currentFMR = 3400

  if (amountIndex)
    return (
      <Strong>{currencyFormatter.format(amountIndex.FCA * currentFCA)}</Strong>
    )
  if (amount) return <Strong>{currencyFormatter.format(amount)}</Strong>
}
