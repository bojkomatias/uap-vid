import { Fragment, type ReactNode } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Check, ChevronDown } from 'tabler-icons-react'
import clsx from 'clsx'
import type { Column } from '@tanstack/react-table'

export default function ColumnVisibilityDropdown({
    columns,
}: {
    columns: Column<any, unknown>[]
}) {
    return (
        <Menu as="div" className="relative">
            <div>
                <Menu.Button className="inline-flex w-full items-center justify-center gap-x-1.5 rounded-md bg-white px-3 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    Columnas
                    <ChevronDown
                        className="-mr-1 h-4 w-4 text-gray-400"
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
                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    static
                >
                    <div className="py-1">
                        {columns.map(
                            (column) =>
                                column.getCanHide() && (
                                    <Menu.Item key={column.id}>
                                        {({ active }) => (
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    column.toggleVisibility(
                                                        !column.getIsVisible()
                                                    )
                                                }}
                                                className={clsx(
                                                    active
                                                        ? 'bg-gray-100 text-gray-900'
                                                        : 'text-gray-700',
                                                    'flex w-full items-center gap-1 px-4 py-2 text-sm'
                                                )}
                                            >
                                                {column.getIsVisible() ? (
                                                    <Check className="h-4 w-4 stroke-gray-600" />
                                                ) : (
                                                    <span className="w-4" />
                                                )}
                                                {
                                                    column.columnDef
                                                        .header as ReactNode
                                                }
                                            </button>
                                        )}
                                    </Menu.Item>
                                )
                        )}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}
