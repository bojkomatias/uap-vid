import { currencyFormatter } from '@utils/formatters'
import React, { useState } from 'react'

/**
 * @param defaultPrice will be set to the number value passed as an argument. Eg: default price is $1.000,00, the argument should be 1000
 * @param priceSetter this is a callback function, it's triggered onBlur (from the input field). e can be used to access the value of the input.
 * @param className CSS clases for the input field
 */
const CurrencyInput = ({
    defaultPrice,
    priceSetter,
    className,
}: {
    defaultPrice?: number
    priceSetter?: React.ChangeEventHandler<HTMLInputElement>
    className?: string
}) => {
    const [amount, setAmount] = useState(
        defaultPrice && formatCurrency((defaultPrice * 100).toString())
    )

    return (
        <div className="relative flex items-center">
            <span className=" absolute ml-2 text-sm text-gray-400">$</span>
            <input
                name="price"
                id="price-input"
                type="text"
                value={amount}
                //I'm calling the setAmount here to format the value shown in the input field everytime the user types a new number.
                onChange={(e) => {
                    setAmount(
                        formatCurrency(e.target.value) === '0,00'
                            ? ''
                            : formatCurrency(e.target.value)
                    )
                }}
                onBlur={(e) => {
                    priceSetter && priceSetter(e)
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
            ?.replace(new RegExp('\\' + thousandSeparator, 'g'), '')
            .replace(new RegExp('\\' + decimalSeparator), '.')
    )
}

// Local porque solo acá se usa! Solo en inputs recibo string y paso a number...
// El resto del formatting es de number => number lindo, nada más (eso de (* 100 / 100).toString() no me va)
const formatCurrency = (value: string) => {
    console.log('formatted value', value.replace(/\D/g, ''))
    const formattedValue = value.replace(/\D/g, '') // Remove non-numeric characters
    const numberValue = Number(formattedValue)
    console.log(
        'currency formatter',
        currencyFormatter.format(numberValue / 100)
    )
    return currencyFormatter.format(numberValue / 100) // Convert back to number before formatting
}
