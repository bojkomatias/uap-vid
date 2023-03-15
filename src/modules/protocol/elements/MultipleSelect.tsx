'use client'
import { PropsWithChildren, useEffect, useState } from 'react'
import { Combobox } from '@headlessui/react'
import { useProtocolContext } from '../../../utils/createContext'
import { Check, Selector, X } from 'tabler-icons-react'
import clsx from 'clsx'

export default function MultipleSelect({
    path,
    x,
    label,
    options,
}: PropsWithChildren<{
    path: string
    x: string
    label: string
    options: string[]
}>) {
    const form = useProtocolContext()
    const [selected, setSelected] = useState<any[]>(
        form.values.sections.identification.sponsor
    )

    useEffect(() => {
        form.setFieldValue(path + x, selected)
    }, [selected])

    return (
        <div>
            <label className="label">{label}</label>
            <Combobox as="div" onChange={setSelected} value={selected} multiple>
                <div className="relative">
                    <Combobox.Button className="relative w-full">
                        <Combobox.Input
                            autoComplete="off"
                            className={'input'}
                            placeholder={label}
                            displayValue={(e: string[]) =>
                                selected.length < 2
                                    ? e.join(', ')
                                    : e.map((x) => x.split('-')[1]).join(' | ')
                            }
                        />

                        <div className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none ">
                            <X
                                className="h-5 p-1 rounded-full hover:scale-110 active:scale-95 hover:bg-gray-100 hover:stroke-2 text-gray-400 transition-all duration-200 hover:text-gray-700 mr-1"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setSelected([])
                                }}
                                aria-hidden="true"
                            />
                            <Selector
                                className="h-5  text-primary transition-all duration-200 hover:text-base-400"
                                aria-hidden="true"
                            />
                        </div>
                    </Combobox.Button>
                    {form.errors[path + x] ? (
                        <p className=" pt-1 pl-3 text-xs text-gray-600 saturate-[80%]">
                            *{form.errors[path + x]}
                        </p>
                    ) : null}

                    <Combobox.Options className="absolute z-10 mt-1.5 max-h-60 w-full overflow-auto rounded bg-white py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {options.map((value: string, index: any) => (
                            <Combobox.Option
                                key={index}
                                value={value}
                                className={({ active }) =>
                                    clsx(
                                        'relative cursor-default select-none py-2 pl-8 pr-4',
                                        active ? 'bg-gray-100' : 'text-base-600'
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
                                                    active ? 'text-white' : ''
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
                </div>
            </Combobox>
        </div>
    )
}
