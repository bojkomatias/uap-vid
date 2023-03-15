import clsx from 'clsx'
import React, { PropsWithChildren } from 'react'
import { useProtocolContext } from '../../../utils/createContext'

const Input = ({
    path,
    label,
    prefix,
    type = 'text',
}: PropsWithChildren<{
    path: string
    label: string
    prefix?: JSX.Element
    type?: 'text' | 'number'
}>) => {
    const form = useProtocolContext()

    return (
        <div className="relative">
            <label className="label">{label}</label>
            {prefix ? (
                <div className="pointer-events-none absolute top-8 mt-1 pt-px left-0 flex items-center pl-2">
                    {prefix}
                </div>
            ) : null}
            <input
                type={type}
                {...form.getInputProps(path)}
                className={clsx(
                    'input',
                    prefix ? 'pl-8' : '',
                    type === 'number' ? 'text-right' : ''
                )}
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
