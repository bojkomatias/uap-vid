import { PropsWithChildren, useEffect, useState } from 'react'
import { Combobox } from '@headlessui/react'
import { useProtocolContext } from '../../../utils/createContext'
import { Check, Selector } from 'tabler-icons-react'

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

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
        <div className="m-3 p-1">
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

                        <div className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none ">
                            <Selector
                                className="h-5 w-5 text-primary transition-all duration-200 hover:text-base-400"
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
                        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {filteredValues.map((value: any, index: any) => (
                                <Combobox.Option
                                    key={index}
                                    value={value}
                                    className={({ active }) =>
                                        classNames(
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
                                                className={classNames(
                                                    'block truncate',
                                                    selected &&
                                                        'font-semibold text-primary'
                                                )}
                                            >
                                                {value}
                                            </span>

                                            {selected && (
                                                <span
                                                    className={classNames(
                                                        'absolute inset-y-0 left-0 flex items-center pl-1.5 text-primary',
                                                        active
                                                            ? 'text-white'
                                                            : 'text-indigo-600'
                                                    )}
                                                >
                                                    <Check
                                                        className="h-4 w-4 text-primary ml-1"
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
