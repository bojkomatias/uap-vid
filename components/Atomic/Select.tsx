import { PropsWithChildren, useState } from 'react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { Combobox } from '@headlessui/react'
import { InputType } from '../../config/enums'

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export default function Select({
    data,
}: PropsWithChildren<{
    data: {
        type: InputType
        title: string
        value: any
    }
}>) {
    const [query, setQuery] = useState('')
    const [selectedValue, setSelectedValue] = useState()

    const filteredValues =
        query === ''
            ? data.value
            : data.value.filter((value: any) => {
                  return value.toLowerCase().includes(query.toLowerCase())
              })

    return (
        <Combobox as="div" value={selectedValue} onChange={setSelectedValue}>
            {/* <Combobox.Label className="text-gray-700 block text-sm font-medium capitalize">
                {data.title}
            </Combobox.Label> */}
            <div className="relative mt-1">
                <Combobox.Input
                    className="shadowInner focus:border-primary sm:text-md w-full p-3 py-2 pl-3 pr-10  capitalize shadow-inner placeholder:capitalize focus:outline-none  focus:ring-1 focus:ring-primary-100"
                    onChange={(event) => setQuery(event.target.value)}
                    displayValue={(value: any) => value}
                    placeholder={data.title}
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none ">
                    <SelectorIcon
                        className="text-primary h-5 w-5 transition-all duration-200 hover:text-base-400"
                        aria-hidden="true"
                    />
                </Combobox.Button>

                {filteredValues.length > 0 && (
                    <Combobox.Options className="bg-white ring-black text-primary absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base ring-1 ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredValues.map((value: any, index: any) => (
                            <Combobox.Option
                                key={index}
                                value={value}
                                className={({ active }) =>
                                    classNames(
                                        'text-primary relative cursor-default select-none py-2 pl-8 pr-4',
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
                                                    'text-primary absolute inset-y-0 left-0 flex items-center pl-1.5',
                                                    active
                                                        ? 'text-white'
                                                        : 'text-indigo-600'
                                                )}
                                            >
                                                <CheckIcon
                                                    className="text-primary h-5 w-5"
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
