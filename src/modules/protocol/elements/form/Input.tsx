import { useProtocolContext } from '@utils/createContext'
import { PropsWithChildren } from 'react'

const Input = ({
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
                {...form.getInputProps(path)}
                className="input"
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

export default Input
