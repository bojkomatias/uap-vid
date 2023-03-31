'use client'
import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { Check, ChevronDown, FilePlus } from 'tabler-icons-react'
import clsx from 'clsx'
import Link from 'next/link'
import { Button } from './Button'

export default function MultipleButton({
    options,
}: {
    options: { title: string; description: string; href: string }[]
}) {
    const [selected, setSelected] = useState(options[0])
    return (
        <Listbox value={selected} onChange={setSelected}>
            {({ open }) => (
                <div className="relative">
                    <div className="inline-flex rounded-md shadow-sm">
                        <Link href={selected.href} passHref>
                            <Button
                                intent={'tertiary'}
                                className="rounded-r-none"
                            >
                                <FilePlus className="mr-3 h-5" /> Crear en{' '}
                                {selected.title}
                            </Button>
                        </Link>
                        <Listbox.Button
                            as={Button}
                            intent={'tertiary'}
                            className="border-l-none ml-px rounded-l-none"
                            // className="inline-flex items-center rounded-l-none rounded-r-md bg-primary p-2 ring-primary ring-offset-2 ring-offset-white hover:bg-primary hover:ring-2 focus:outline-none focus:ring-2"
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
                                        clsx(
                                            active
                                                ? 'bg-primary text-white'
                                                : 'text-gray-900',
                                            'cursor-default select-none px-5 pb-3 pt-4 text-sm'
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
                                                className={clsx(
                                                    active
                                                        ? 'text-gray-300'
                                                        : 'text-gray-500',
                                                    'mt-1 text-xs font-thin'
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
