import type { AmountIndex } from '@prisma/client'
import { cx } from '@utils/cx'
import React from 'react'
import { ArrowNarrowDown, ArrowNarrowUp } from 'tabler-icons-react'

const BudgetCardDelta = ({ delta }: { delta: AmountIndex }) => {
  const deltaStringRounded = delta.FCA.toFixed(1)
  // This is a workaroud to handle values that we show as zero but are not zero. 
  const isPositive = delta.FCA > -0.49
  const isInfinite = delta.FCA === Infinity
  return (
    <div
      className={cx(
        isPositive  ?
          'bg-green-100 text-green-800'
        : 'bg-red-100 text-red-800',
        'inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0'
      )}
    >
      {delta.FCA >= 0 ?
        <ArrowNarrowUp
          className="-ml-1 mr-0.5 h-4 w-4 flex-shrink-0 self-center text-success-600"
          aria-hidden="true"
        />
      : <ArrowNarrowDown
          className="-ml-1 mr-0.5 h-4 w-4 flex-shrink-0 self-center text-error-700"
          aria-hidden="true"
        />
      }
      {/* How should be managed this? an early return is another option */}
      {isPositive && !isInfinite ? '+ ' : ''}
      {isInfinite ? '': deltaStringRounded}%
    </div>
  )
}

export default BudgetCardDelta
