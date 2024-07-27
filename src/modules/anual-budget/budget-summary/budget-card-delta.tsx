import { cx } from '@utils/cx'
import React from 'react'
import { ArrowNarrowDown, ArrowNarrowUp } from 'tabler-icons-react'

const BudgetCardDelta = ({ delta }: { delta: number }) => {
  return (
    <div
      className={cx(
        delta > 0 ?
          'bg-green-200 text-green-800 dark:bg-green-800/80 dark:text-green-100'
        : 'bg-red-200 text-red-800 dark:bg-red-900/80 dark:text-red-200',
        'inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0'
      )}
    >
      {delta >= 0 ?
        <ArrowNarrowUp
          className="-ml-1 mr-0.5 h-4 w-4 flex-shrink-0 self-center text-teal-500"
          aria-hidden="true"
        />
      : <ArrowNarrowDown
          className="-ml-1 mr-0.5 h-4 w-4 flex-shrink-0 self-center text-red-500"
          aria-hidden="true"
        />
      }
      {delta > 0 ? '+ ' : ''}
      {delta.toFixed(1)}%
    </div>
  )
}

export default BudgetCardDelta
