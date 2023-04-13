import { useProtocolContext } from '@utils/createContext'
import type { PropsWithChildren } from 'react'

const Input = ({
    path,
    label,
    disabled,
}: PropsWithChildren<{
    path: string
    label: string
    disabled?: true
}>) => {
    const form = useProtocolContext()

    return (
        <div>
            <label className="label">{label}</label>
            <input
                disabled={disabled}
                {...form.getInputProps(path)}
                className="input form-input"
                placeholder={label}
                autoComplete="off"
            />
            {form.getInputProps(path).error ? (
                <p className=" pl-3 pt-1 text-xs text-gray-600 saturate-[80%]">
                    *{form.getInputProps(path).error}
                </p>
            ) : null}
        </div>
    )
}

export default Input
