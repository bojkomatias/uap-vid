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
        <div className="max-w-[8rem]">
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
                onBlur={() =>
                    form.setFieldValue(
                        path,
                        Number(form.getInputProps(path).value)
                    )
                }
                className="input text-right placeholder:text-left"
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
