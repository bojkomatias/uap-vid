'use client'
import { Combobox } from '@headlessui/react'
import type { User } from '@prisma/client'
import clsx from 'clsx'
import { useState } from 'react'
import { Check, Selector } from 'tabler-icons-react'

export function SecretaryMultipleSelect({
    secretaries,
    currentSecretaries,
}: {
    secretaries: User[]
    currentSecretaries: User[]
}) {
    const [selectedSecretaries, setSelectedSecretaries] =
        useState(currentSecretaries)

    return (
        <Combobox
            value={selectedSecretaries}
            onChange={setSelectedSecretaries}
            multiple
        >
            <div className="relative">
                <Combobox.Button className="relative w-full">
                    <Combobox.Input
                        autoComplete="off"
                        className={'input text-sm'}
                        displayValue={(secretaries: User[]) =>
                            secretaries.map((sec) => sec.name).join(', ')
                        }
                    />

                    <div className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none ">
                        <Selector
                            className="h-5  text-primary transition-all duration-200 hover:text-base-400"
                            aria-hidden="true"
                        />
                    </div>
                </Combobox.Button>

                <Combobox.Options className="absolute z-20 mt-1.5 max-h-60 w-full overflow-auto rounded border border-gray-300 bg-white py-1 shadow focus:outline-none sm:text-sm">
                    {secretaries.map((secretary) => (
                        <Combobox.Option
                            key={secretary.id}
                            value={secretary}
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
                                        <span>{secretary.name}</span>
                                    </span>

                                    {selected && (
                                        <span
                                            className={clsx(
                                                'absolute inset-y-0 left-0 flex items-center pl-1.5 text-primary',
                                                active ? 'text-white' : ''
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
                    ))}
                </Combobox.Options>
            </div>
        </Combobox>
    )
}
