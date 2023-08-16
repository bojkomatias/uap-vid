/* eslint-disable @typescript-eslint/no-unused-vars */
import { Fragment, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Check, ChevronDown } from 'tabler-icons-react'
import clsx from 'clsx'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUpdateQuery } from '@utils/updateQuery'

export default function RecordsDropdown({ options }: { options: number[] }) {
    const update = useUpdateQuery()
    const searchParams = useSearchParams()

    return (
        <Menu as="div" className="relative float-right text-left">
            <div>
                <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    Cantidad de registros: {searchParams?.get('records')}
                    <ChevronDown
                        className="-mr-1 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                    />
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items
                    className="absolute right-0 z-10 mt-2 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    static
                >
                    <div className="py-1">
                        {options.slice(0, options.length - 1).map((o, idx) => (
                            <Menu.Item key={idx}>
                                {({ active }) => (
                                    <button
                                        onClick={() =>
                                            update({
                                                records: o,
                                                page:
                                                    Math.ceil(
                                                        options[
                                                            options.length - 1
                                                        ] / o
                                                    ) == 1
                                                        ? 1
                                                        : Number(
                                                              searchParams?.get(
                                                                  'page'
                                                              )
                                                          ),
                                            })
                                        }
                                        className={clsx(
                                            active
                                                ? 'bg-gray-100 text-gray-900'
                                                : 'text-gray-700',
                                            'flex w-full items-center justify-center gap-1 px-4 py-2 text-sm'
                                        )}
                                    >
                                        {Number(searchParams.get('records')) ===
                                        o ? (
                                            <div className="flex items-center font-bold">
                                                <Check className="mr-1 h-4 w-4" />
                                                {o}
                                            </div>
                                        ) : (
                                            o
                                        )}
                                    </button>
                                )}
                            </Menu.Item>
                        ))}
                        <Menu.Item key={options.length}>
                            {({ active }) => (
                                <button
                                    onClick={() =>
                                        update({
                                            records:
                                                options[options.length - 1],
                                        })
                                    }
                                    className={clsx(
                                        active
                                            ? 'bg-gray-100 text-gray-900'
                                            : 'text-gray-700',
                                        ' flex w-full items-center justify-end gap-1 px-4 py-2  text-sm'
                                    )}
                                >
                                    {Number(searchParams.get('records')) ===
                                    options[options.length - 1] ? (
                                        <div className=" flex items-center font-bold">
                                            <Check className=" mr-1 h-4 w-4" />
                                            Todos los registros
                                        </div>
                                    ) : (
                                        <>Todos los registros</>
                                    )}
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}
