'use client'

import { Strong } from '@components/text'
import type { AmountIndex } from '@prisma/client'
import { getCurrentIndexes } from '@repositories/finance-index'
import { useQuery } from '@tanstack/react-query'
import { currencyFormatter } from '@utils/formatters'
import { useAtom } from 'jotai'
import { indexSwapAtom } from './index-swapper'

/**
    @amountIndex the indexes values to map and display
    @amount the value to display if value is not indexed
  */
export function Currency({ amountIndex }: { amountIndex: AmountIndex }) {
  const [value] = useAtom(indexSwapAtom)

  const { isError, data } = useQuery({
    queryKey: ['indexes'],
    queryFn: async () => await getCurrentIndexes(),
  })

  if (isError || !data) return

  return (
    <Strong>
      {value === 'default' ?
        currencyFormatter.format(amountIndex.FCA * data.currentFCA)
      : value === 'fca' ?
        amountIndex.FCA.toPrecision(3) + ' FCA'
      : amountIndex.FMR.toPrecision(3) + ' FMR'}
    </Strong>
  )
}
