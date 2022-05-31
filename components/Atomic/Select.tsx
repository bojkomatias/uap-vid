import { PropsWithChildren, useEffect, useState } from 'react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { Combobox } from '@headlessui/react'
import { InputType } from '../../config/enums'
import { Input as InputT } from '../../config/types'

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export default function Select({
    data,
    updateData,
}: PropsWithChildren<{
    data: InputT
    updateData: Function
}>) {
    const [query, setQuery] = useState('')
    const [selectedValue, setSelectedValue] = useState()

    useEffect(() => {
        updateData({
            type: data.type,
            title: data.title,
            value: selectedValue,
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedValue])

    const filteredValues =
        query === ''
            ? data.options
            : data.options?.filter((value: any) => {
                  return value.toLowerCase().includes(query.toLowerCase())
              })

    return (
        <Combobox as="div" value={selectedValue} onChange={setSelectedValue}>
            {/* <Combobox.Label className="text-gray-700 block text-sm font-medium capitalize">
                {data.title}
            </Combobox.Label> */}
            <div className="relative mt-1">
                <Combobox.Input
                    className="input"
                    onChange={(event) => setQuery(event.target.value)}
                    displayValue={(value: any) => value}
                    placeholder={data.title}
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none ">
                    <SelectorIcon
                        className="h-5 w-5 text-primary transition-all duration-200 hover:text-base-400"
                        aria-hidden="true"
                    />
                </Combobox.Button>

                {filteredValues.length > 0 && (
                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base text-primary ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredValues.map((value: any, index: any) => (
                            <Combobox.Option
                                key={index}
                                value={value}
                                className={({ active }) =>
                                    classNames(
                                        'relative cursor-default select-none py-2 pl-8 pr-4 text-primary',
                                        active
                                            ? 'bg-indigo-600 text-primary'
                                            : 'text-base-400'
                                    )
                                }
                            >
                                {({ active, selected }) => (
                                    <>
                                        <span
                                            className={classNames(
                                                'block truncate',
                                                selected && 'font-semibold'
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
                                                <CheckIcon
                                                    className="h-5 w-5 text-primary"
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
    )
}
