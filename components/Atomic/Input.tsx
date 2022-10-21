import React, { PropsWithChildren } from 'react'
import { useProtocolContext } from '../../config/createContext'

const Input = ({
    path,
    x,
    label,
}: PropsWithChildren<{ path: string; x: string; label: string }>) => {
    const form = useProtocolContext()
    return (
        <div className="m-3 p-1">
            <label
                className={`text-[0.6rem] font-thin uppercase 
                            text-base-700/80`}
            >
                {label}
            </label>
            <input
                required
                {...form.getInputProps(path + x)}
                className="input"
                placeholder={label}
            />
        </div>
    )
}

export default Input
