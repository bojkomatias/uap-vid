import { cx } from '@utils/cx'
import type { PropsWithChildren } from 'react'
import { useProtocolContext } from '../../../../utils/createContext'

const NumberInput = ({
    path,
    label,
}: PropsWithChildren<{
    path: string
    label: string
}>) => {
    const form = useProtocolContext()

    return (
        <div className="max-w-[6rem]">
            <label
                className={cx(
                    'label required',
                    form.getInputProps(path).error && 'after:text-error-500'
                )}
            >
                {label}
            </label>
            <input
                type="number"
                {...form.getInputProps(path)}
                onBlur={(e) => form.setFieldValue(path, Number(e.target.value))}
                className="input text-right"
                placeholder={label}
                autoComplete="off"
            />
            {form.getInputProps(path).error ? (
                <p className="error">*{form.getInputProps(path).error}</p>
            ) : null}
        </div>
    )
}

export default NumberInput
