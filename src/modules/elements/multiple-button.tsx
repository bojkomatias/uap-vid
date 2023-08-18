'use client'
import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { Check, ChevronDown, FilePlus } from 'tabler-icons-react'
import { cx } from '@utils/cx'
import Link from 'next/link'
import { Button } from './button'
import { buttonStyle } from './button/styles'


export default function MultipleButton({
    defaultValue,
    options,
}: {
    defaultValue: { title: string; description: string; href: string } | null
    options: { title: string; description: string; href: string }[]
}) {
    const [selected, setSelected] = useState(
        defaultValue ? defaultValue : options[0]
    )
    return (
        <Listbox value={selected} onChange={setSelected}>
            {({ open }) => (
                <div className="relative">
                    <div className="inline-flex rounded-md shadow-sm">
                        <Link
                            href={selected.href}
                            className={cx(
                                'hover:z-10 focus-visible:z-10',
                                buttonStyle('outline'),
                                'rounded-r-none'
                            )}
                            passHref
                        >
                            <FilePlus className="mr-2 h-5" /> Crear en{' '}
                            {selected.title}
                        </Link>
                        <Listbox.Button
                            as={Button}
                            intent="outline"
                            className="border-l-none ml-px rounded-l-none"
                        >
                            <span className="sr-only">
                                Change published status
                            </span>
                            <ChevronDown
                                className="h-5 w-5 text-primary"
                                aria-hidden="true"
                            />
                        </Listbox.Button>
                    </div>

                    <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="absolute right-0 z-10 mt-2 w-72 origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {options.map((option) => (
                                <Listbox.Option
                                    key={option.title}
                                    className={({ active }) =>
                                        cx(
                                            'cursor-default select-none px-5 pb-3 pt-4 text-sm',
                                            active
                                                ? 'bg-primary text-white'
                                                : 'text-gray-900'
                                        )
                                    }
                                    value={option}
                                >
                                    {({ selected, active }) => (
                                        <div className="flex flex-col">
                                            <div className="flex justify-between text-xs uppercase">
                                                <p
                                                    className={
                                                        selected
                                                            ? 'font-semibold'
                                                            : 'font-normal'
                                                    }
                                                >
                                                    {option.title}
                                                </p>
                                                {selected ? (
                                                    <span
                                                        className={
                                                            active
                                                                ? 'text-white'
                                                                : 'text-primary'
                                                        }
                                                    >
                                                        <Check
                                                            className="h-5 w-5"
                                                            aria-hidden="true"
                                                        />
                                                    </span>
                                                ) : null}
                                            </div>
                                            <p
                                                className={cx(
                                                    'mt-1 text-xs font-light',
                                                    active
                                                        ? 'text-gray-300'
                                                        : 'text-gray-500'
                                                )}
                                            >
                                                {option.description}
                                            </p>
                                        </div>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            )}
        </Listbox>
    )
}
