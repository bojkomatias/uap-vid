'use client'

import { Strong } from '@components/text'
import type { AmountIndex } from '@prisma/client'
import { getCurrentIndexes } from '@repositories/finance-index'
import { useQuery } from '@tanstack/react-query'
import { currencyFormatter } from '@utils/formatters'

type CurrencyProps = { amountIndex: AmountIndex } | { amount: number }

/**
  @amountIndex the indexes values to map and display
  @amount the value to display if value is not indexed
*/
export function Currency(props: CurrencyProps) {
  const { isError, data } = useQuery({
    queryKey: ['indexes'],
    queryFn: async () => await getCurrentIndexes(),
  })

  if (isError || !data) return

  if ('amountIndex' in props)
    return (
      <Strong>
        {currencyFormatter.format(props.amountIndex.FCA * data.currentFCA)}
      </Strong>
    )

  // If amount is passed means no amount indexed
  if ('amount' in props)
    return <Strong>{currencyFormatter.format(props.amount)}</Strong>
}
