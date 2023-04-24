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
            <label className="label">{label}</label>
            <input
                value={form.getInputProps(path).value}
                type="number"
                onChange={(e) =>
                    form.setFieldValue(path, Number(e.target.value))
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
