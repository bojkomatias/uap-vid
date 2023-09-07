import React from 'react'
import { Badge } from './badge'
import { formatCurrency } from '@utils/formatters'

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
                    ${formatCurrency((amount * 100).toString())} {currency}
                </>
            )}
        </Badge>
    )
}
