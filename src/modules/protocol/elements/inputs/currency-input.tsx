import { cx } from '@utils/cx'
import type { PropsWithChildren } from 'react'
import { useProtocolContext } from '../../../../utils/createContext'

const CurrencyInput = ({
    path,
    label,
}: PropsWithChildren<{
    path: string
    label: string
}>) => {
    const form = useProtocolContext()

    return (
        <div className="relative">
            <label
                className={cx(
                    'label required',
                    form.getInputProps(path).error && 'after:text-error-500'
                )}
            >
                {label}
            </label>
            <div className="pointer-events-none absolute left-0 top-8 mt-0.5 flex items-center pt-px">
                <span className="ml-3 text-sm text-gray-400">$</span>
            </div>
            <div className="pointer-events-none absolute right-3 top-8 mt-1 flex items-center">
                <span className="text-sm text-gray-400">ARS</span>
            </div>
            <input
                value={form
                    .getInputProps(path)
                    .value.toString()
                    .replace(/\D/g, '')
                    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                onChange={(e) => {
                    if (isNaN(form.getInputProps(path).value)) {
                        return form.setFieldValue(path, 0)
                    }
                    form.setFieldValue(
                        path,
                        parseInt(
                            e.target.value
                                .replace(/\./g, '')
                                .replace(/\^$/, '0')
                        )
                    )
                }}
                onBlur={() => {
                    if (isNaN(form.getInputProps(path).value)) {
                        form.setFieldValue(path, 0)
                    }
                }}
                className="input pl-6"
                placeholder={label}
                autoComplete="off"
            />
            {form.getInputProps(path).error ? (
                <p className="error">*{form.getInputProps(path).error}</p>
            ) : null}
        </div>
    )
}

export default CurrencyInput
