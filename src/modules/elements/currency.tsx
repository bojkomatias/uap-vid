import React from 'react'
import { Badge } from './badge'
import { currencyFormatter } from '@utils/formatters'

export default function Currency({
    amount = 0,
    currency = 'ARS',
    title,
}: {
    amount?: number
    currency?: string
    title?: string
}) {
    return (
        <Badge title={title} className="text-xs text-gray-600">
            {amount == 0 || !amount ? (
                <>No se especificó</>
            ) : (
                <>
                    ${currencyFormatter.format(amount)} {currency}
                </>
            )}
        </Badge>
    )
}
