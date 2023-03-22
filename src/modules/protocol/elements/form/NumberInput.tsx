import { PropsWithChildren } from 'react'
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
        <div>
            <label className="label">{label}</label>
            <input
                value={form.getInputProps(path).value}
                type="number"
                onChange={(e) =>
                    form.setFieldValue(path, Number(e.target.value))
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

export default NumberInput
