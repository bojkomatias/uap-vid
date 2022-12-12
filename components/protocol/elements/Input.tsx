import React, { PropsWithChildren } from 'react'
import { useProtocolContext } from '../../../config/createContext'

const Input = ({
    path,
    x,
    label,
}: PropsWithChildren<{
    path: string
    x: string
    label: string
    error?: string
}>) => {
    const form = useProtocolContext()
    return (
        <div className="m-3 p-1">
            <label
                className={`text-xs font-normal  uppercase  
                            text-base-700/60`}
            >
                {label}
            </label>
            <input
                {...form.getInputProps(path + x)}
                className={`input`}
                placeholder={label}
                autoComplete="off"
            />
            {form.errors[path + x] ? (
                <p className=" pt-1 pl-3 text-xs text-secondary-600 saturate-[80%]">
                    *{form.errors[path + x]}
                </p>
            ) : null}
        </div>
    )
}

export default Input
