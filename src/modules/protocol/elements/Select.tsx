import { PropsWithChildren, useEffect, useState } from 'react'
import { Combobox } from '@headlessui/react'
import { useProtocolContext } from '../../../utils/createContext'
import { Check, Selector, X } from 'tabler-icons-react'
import clsx from 'clsx'

export default function Select({
    path,
    x,
    label,
    options,
    conditionalCleanup = () => null,
}: PropsWithChildren<{
    path: string
    x: string
    label: string
    options: any
    conditionalCleanup?: any
}>) {
    const form = useProtocolContext()
    const [query, setQuery] = useState('')

    const filteredValues =
        query === ''
            ? options
            : options?.filter((value: any) => {
                  return value.toLowerCase().includes(query.toLowerCase())
              })

    return (
        <div>
            <label className="label">{label}</label>
            <Combobox as="div" {...form.getInputProps(path + x)}>
                <div className="relative">
                    <Combobox.Button
                        className="relative w-full"
                        onClick={conditionalCleanup}
                    >
                        <Combobox.Input
                            autoComplete="off"
                            className="input"
                            placeholder={label}
                            onChange={(e) => setQuery(e.target.value)}
                        />

                        <div className="absolute inset-y-0 right-0 flex items-center rounded-r-md focus:outline-none pr-2">
                            <X
                                className="h-5 w-5 p-1 rounded-full hover:scale-110 active:scale-95 hover:bg-gray-100 hover:stroke-2 text-gray-400 transition-all duration-200 hover:text-gray-700"
                                onClick={(e) => {
                                    form.setFieldValue(path + x, '')
                                    e.stopPropagation()
                                }}
                                aria-hidden="true"
                            />
                            <Selector
                                className="h-5 text-primary transition-all duration-200 hover:text-base-400"
                                aria-hidden="true"
                            />
                        </div>
                    </Combobox.Button>
                    {form.errors[path + x] ? (
                        <p className=" pt-1 pl-3 text-xs text-gray-600 saturate-[80%]">
                            *{form.errors[path + x]}
                        </p>
                    ) : null}

                    {filteredValues?.length > 0 && (
                        <Combobox.Options className="absolute z-10 mt-1.5 max-h-60 w-full overflow-auto rounded bg-white py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {filteredValues.map((value: string, index: any) => (
                                <Combobox.Option
                                    key={index}
                                    value={value}
                                    className={({ active }) =>
                                        clsx(
                                            'relative cursor-default select-none py-2 pl-8 pr-4',
                                            active
                                                ? 'bg-gray-100'
                                                : 'text-base-600'
                                        )
                                    }
                                >
                                    {({ active, selected }) => (
                                        <>
                                            <span
                                                className={clsx(
                                                    'block truncate',
                                                    selected &&
                                                        'font-semibold text-primary'
                                                )}
                                            >
                                                <span>{value}</span>
                                            </span>

                                            {selected && (
                                                <span
                                                    className={clsx(
                                                        'absolute inset-y-0 left-0 flex items-center pl-1.5 text-primary',
                                                        active
                                                            ? 'text-white'
                                                            : ''
                                                    )}
                                                >
                                                    <Check
                                                        className="h-4 w-4 text-gray-500 ml-1"
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                            )}
                                        </>
                                    )}
                                </Combobox.Option>
                            ))}
                        </Combobox.Options>
                    )}
                </div>
            </Combobox>
        </div>
    )
}
