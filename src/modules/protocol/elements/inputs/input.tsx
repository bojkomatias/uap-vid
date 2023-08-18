import { useProtocolContext } from '@utils/createContext'
import { cx } from '@utils/cx'
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
                className={cx(
                    'label required',
                    form.getInputProps(path).error && 'after:text-error-500'
                )}
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
