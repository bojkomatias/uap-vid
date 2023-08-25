/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from 'react'

const CurrencyInput = ({
    defaultPrice,
    priceSetter,
    className,
}: {
    defaultPrice?: number
    priceSetter: Function
    className?: string
}) => {
    const formatCurrency = (value: string) => {
        const formattedValue = value.replace(/\D/g, '') // Remove non-numeric characters
        const numberValue = Number(formattedValue)
        return new Intl.NumberFormat('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(numberValue / 100) // Convert back to number before formatting
    }

    const [amount, setAmount] = useState(
        (defaultPrice && formatCurrency(defaultPrice.toString() + ',00')) || ''
    )

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value
        const formattedValue = formatCurrency(inputValue)
        setAmount(formattedValue === '0,00' ? '' : formattedValue)
    }

    return (
        <div className="relative flex items-center">
            <span className=" absolute ml-2 text-sm text-gray-400">$</span>
            <input
                name="price"
                id="price-input"
                type="text"
                value={amount}
                onChange={(e) => {
                    handleChange(e)
                    priceSetter(e)
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
