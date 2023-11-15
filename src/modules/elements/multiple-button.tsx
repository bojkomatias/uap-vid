'use client'
import type { MouseEventHandler } from 'react'
import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { Check, ChevronDown, FilePlus } from 'tabler-icons-react'
import { cx } from '@utils/cx'
import Link from 'next/link'
import { Button } from './button'
import { buttonStyle } from './button/styles'

type Option = {
    title: string
    description: string
    href?: string
    onClick?: MouseEventHandler<HTMLButtonElement>
}

export default function MultipleButton({
    defaultValue,
    options,
    position,
}: {
    defaultValue: Option
    options: Option[]
    position?: string
}) {
    const [selected, setSelected] = useState(
        defaultValue ? defaultValue : options[0]
    )
    return (
        <Listbox value={selected} onChange={setSelected}>
            {({ open }) => (
                <div className="relative">
                    <div className="inline-flex rounded-md shadow-sm">
                        {selected.onClick ? (
                            <Button
                                intent="secondary"
                                className={cx(
                                    'hover:z-10 focus-visible:z-10',
                                    'rounded-r-none'
                                )}
                                onClick={selected.onClick}
                            >
                                <FilePlus className="h-4 text-current" />
                                {selected.title}
                            </Button>
                        ) : (
                            selected.href && (
                                <Link
                                    href={selected.href}
                                    className={cx(
                                        'hover:z-10 focus-visible:z-10',
                                        buttonStyle('secondary'),
                                        'rounded-r-none'
                                    )}
                                >
                                    <FilePlus className="h-4 text-current" />
                                    {selected.title}
                                </Link>
                            )
                        )}
                        <Listbox.Button
                            as={Button}
                            intent="secondary"
                            className="border-l-none ml-px rounded-l-none"
                        >
                            <span className="sr-only">Change selector</span>
                            <ChevronDown
                                className="h-4 w-4 text-current"
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
                        <Listbox.Options
                            className={cx(
                                'z-20 max-h-60 w-72 divide-y overflow-auto rounded-md bg-white shadow-lg ring-1 focus:outline-none',
                                position
                                    ? position
                                    : 'absolute right-0 mt-2 origin-top-right'
                            )}
                        >
                            {options.map((option) => (
                                <Listbox.Option
                                    key={option.title}
                                    className={({ active }) =>
                                        cx(
                                            'cursor-default select-none px-5 pb-3 pt-4 text-sm',
                                            active
                                                ? 'bg-gray-100 text-gray-900'
                                                : 'text-gray-700'
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
                                                                ? 'text-gray-700'
                                                                : 'text-gray-600'
                                                        }
                                                    >
                                                        <Check
                                                            className="h-4 w-4"
                                                            aria-hidden="true"
                                                        />
                                                    </span>
                                                ) : null}
                                            </div>
                                            <p
                                                className={cx(
                                                    'mt-1 text-xs font-light',
                                                    active
                                                        ? 'text-gray-700'
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
