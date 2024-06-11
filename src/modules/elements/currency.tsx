import React from 'react'
import { Badge } from './badge'
import { currencyFormatter } from '@utils/formatters'
import { cx } from '@utils/cx'

export default function Currency({
  amount = 0,
  currency = 'ARS',
  title,
  size = 'xs',
}: {
  amount?: number
  currency?: string
  title?: string
  size?: 'xs' | 'md'
}) {
  return (
    <Badge
      title={title}
      className={cx(
        'text-gray-600',
        size === 'xs' && 'text-xs',
        size === 'md' && 'text-md'
      )}
    >
      {amount === null || amount === undefined ? (
        <>No se especificó</>
      ) : (
        <>
          ${currencyFormatter.format(amount)} {currency}
        </>
      )}
    </Badge>
  )
}
