import { cx } from '@utils/cx'
import { currencyFormatter } from '@utils/formatters'
import React, { useState } from 'react'

/**
 * @param defaultPrice will be set to the number value passed as an argument. Eg: default price is $1.000,00, the argument should be 1000
 * @param priceSetter this is a callback function, it's triggered onBlur (from the input field). The argument it receives is "price" which is a number.
 * @param className CSS clases for the input field
 */

export default function CurrencyInput({
    defaultPrice,
    priceSetter,
    className,
}: {
    defaultPrice?: number

    /** This is a callback function, it takes as an argument the price that's in the input field.
     * @param value number
     */
    priceSetter: (value: number) => void

    className?: string
    maxAmount?: number
}) {
    const [amount, setAmount] = useState(
        (defaultPrice && formatCurrency((defaultPrice * 100).toString())) || ''
    )

    return (
        <div className="relative flex items-center">
            <span className="absolute ml-2 text-sm text-gray-400">$</span>
            <input
                name="price"
                id="price-input"
                type="text"
                value={amount}
                //I'm calling the setAmount here to format the value shown in the input field everytime the user types a new number.
                onChange={(e) => {
                    setAmount(formatCurrency(e.target.value))
                }}
                onBlur={(e) => {
                    const value = e.target.value === '' ? '0' : e.target.value
                    priceSetter(parseLocaleNumber(value, 'es-AR'))
                }}
                placeholder="3499.00"
                className={cx('input pl-5 text-right', className)}
            />
        </div>
    )
}

export function parseLocaleNumber(stringNumber: string, locale: string) {
    const thousandSeparator = Intl.NumberFormat(locale)
        .format(11111)
        .replace(/\d{Number}/g, '')
    const decimalSeparator = Intl.NumberFormat(locale)
        .format(1.1)
        .replace(/\d{Number}/g, '')

    return parseFloat(
        stringNumber
            ?.replace(new RegExp('\\' + thousandSeparator, 'g'), '')
            .replace(new RegExp('\\' + decimalSeparator), '.')
    )
}

const formatCurrency = (value: string) => {
    const formattedValue = value.replace(/\D/g, '') // Remove non-numeric characters
    const numberValue = Number(formattedValue)
    return currencyFormatter.format(numberValue / 100) // Convert back to number before formatting
}
