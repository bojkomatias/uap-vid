import { Fragment, type ReactNode } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDown } from 'tabler-icons-react'
import clsx from 'clsx'
import type { Column } from '@tanstack/react-table'

export default function ColumnVisibilityDropdown({
    columns,
}: {
    columns: Column<any, unknown>[]
}) {
    return (
        <Menu as="div" className="float-right text-left">
            <div>
                <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    Columnas
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
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        {columns.map((column) => (
                            <Menu.Item key={column.id}>
                                {({ active }) => (
                                    <span
                                        onClick={() =>
                                            column.getToggleVisibilityHandler()
                                        }
                                        className={clsx(
                                            active
                                                ? 'bg-gray-100 text-gray-900'
                                                : 'text-gray-700',
                                            'block px-4 py-2 text-sm'
                                        )}
                                    >
                                        {column.columnDef.header as ReactNode}
                                    </span>
                                )}
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}
