import { PropsWithChildren } from 'react'
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
            <label className="label">{label}</label>
            <div className="pointer-events-none absolute top-8 mt-0.5 pt-px left-0 flex items-center">
                <span className="text-sm text-gray-400 ml-3">$</span>
            </div>
            <div className="pointer-events-none absolute top-8 mt-1 right-3 flex items-center">
                <span className="text-sm text-gray-400">ARS</span>
            </div>
            <input
                value={form.getInputProps(path).value}
                onChange={(e) =>
                    form.setFieldValue(
                        path,
                        e.target.value
                            .replace(/\D/g, '')
                            .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                    )
                }
                className="input pl-6"
                placeholder={label}
                autoComplete="off"
            />
            {form.getInputProps(path).error ? (
                <p className=" pt-1 pl-3 text-xs text-gray-600 saturate-[80%]">
                    *{form.getInputProps(path).error}
                </p>
            ) : null}
        </div>
    )
}

export default CurrencyInput
