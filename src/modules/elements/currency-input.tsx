import { currencyFormatter } from '@utils/formatters'
import React, { useState } from 'react'

const CurrencyInput = ({
    defaultPrice,
    priceSetter,
    className,
}: {
    defaultPrice?: number
    priceSetter?: Function
    className?: string
}) => {
    const [amount, setAmount] = useState(
        (defaultPrice && formatCurrency(defaultPrice.toString() + ',00')) || ''
    )

    return (
        <div className="relative flex items-center">
            <span className=" absolute ml-2 text-sm text-gray-400">$</span>
            <input
                name="price"
                id="price-input"
                type="text"
                value={amount}
                onChange={(e) => {
                    setAmount(
                        formatCurrency(e.target.value) === '0,00'
                            ? ''
                            : formatCurrency(e.target.value)
                    )
                    if (priceSetter)
                        priceSetter(parseLocaleNumber(amount, 'es-AR'))
                }}
                onBlur={(e) => {
                    if (priceSetter)
                        priceSetter(parseLocaleNumber(amount, 'es-AR'))
                }}
                placeholder="3400.00"
                className={`${className} input pl-5`}
            />
        </div>
    )
}

export default CurrencyInput

export function parseLocaleNumber(stringNumber: string, locale: string) {
    const thousandSeparator = Intl.NumberFormat(locale)
        .format(11111)
        .replace(/\p{Number}/gu, '')
    const decimalSeparator = Intl.NumberFormat(locale)
        .format(1.1)
        .replace(/\p{Number}/gu, '')

    return parseFloat(
        stringNumber
            .replace(new RegExp('\\' + thousandSeparator, 'g'), '')
            .replace(new RegExp('\\' + decimalSeparator), '.')
    )
}

// Local porque solo acá se usa! Solo en inputs recibo string y paso a number...
// El resto del formatting es de number => number lindo, nada más (eso de (* 100 / 100).toString() no me va)
const formatCurrency = (value: string) => {
    const formattedValue = value.replace(/\D/g, '') // Remove non-numeric characters
    const numberValue = Number(formattedValue)
    return currencyFormatter.format(numberValue / 100) // Convert back to number before formatting
}
