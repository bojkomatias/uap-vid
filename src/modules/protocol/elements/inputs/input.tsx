import { useProtocolContext } from '@utils/createContext'
import clsx from 'clsx'
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
            <label
                className={clsx('label required', {
                    'after:text-error-500': form.getInputProps(path).error,
                })}
            >
                {label}
            </label>
            <input
                disabled={disabled}
                {...form.getInputProps(path)}
                className="input form-input"
                placeholder={label}
                autoComplete="off"
            />
            {form.getInputProps(path).error ? (
                <p className="error">*{form.getInputProps(path).error}</p>
            ) : null}
        </div>
    )
}

export default Input
