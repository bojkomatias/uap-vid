import { useState } from 'react'
import { Combobox } from '@headlessui/react'
import { Check, Selector, X } from 'tabler-icons-react'
import clsx from 'clsx'
import { useProtocolContext } from '@utils/createContext'

export default function Select({
    path,
    label,
    options,
    conditionalCleanup = () => null,
}: {
    path: string
    label: string
    options: string[]
    conditionalCleanup?: (e?: string) => void
}) {
    const form = useProtocolContext()
    const [query, setQuery] = useState('')

    const filteredValues =
        query === ''
            ? options
            : options?.filter((value: string) => {
                  return value.toLowerCase().includes(query.toLowerCase())
              })

    return (
        <div>
            <label className="label">{label}</label>
            <Combobox
                as="div"
                value={form.getInputProps(path).value}
                onChange={(e) => {
                    form.setFieldValue(path, e)
                    conditionalCleanup(e)
                }}
            >
                <div className="relative">
                    <Combobox.Button className="relative w-full">
                        <Combobox.Input
                            autoComplete="off"
                            className="input form-input"
                            placeholder={label}
                            onChange={(e) => setQuery(e.target.value)}
                        />

                        <div className="absolute inset-y-0 right-0 flex items-center rounded-r-md pr-2 focus:outline-none">
                            <X
                                className={clsx(
                                    'h-5 w-5 rounded-full p-1 text-gray-400 transition-all duration-200 hover:scale-110 hover:bg-gray-100 hover:stroke-2 hover:text-gray-700 active:scale-95',
                                    form.getInputProps(path).value === ''
                                        ? 'hidden'
                                        : ''
                                )}
                                onClick={(e) => {
                                    form.setFieldValue(path, '')
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
                    {form.getInputProps(path).error ? (
                        <p className="error">
                            *{form.getInputProps(path).error}
                        </p>
                    ) : null}

                    {filteredValues?.length > 0 && (
                        <Combobox.Options className="absolute z-20 mt-1.5 max-h-60 w-full overflow-auto rounded border border-gray-300 bg-white py-1 text-base shadow focus:outline-none sm:text-sm">
                            {filteredValues.map(
                                (value: string, index: number) => (
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
                                                            className="ml-1 h-4 w-4 text-gray-500"
                                                            aria-hidden="true"
                                                        />
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </Combobox.Option>
                                )
                            )}
                        </Combobox.Options>
                    )}
                </div>
            </Combobox>
        </div>
    )
}
