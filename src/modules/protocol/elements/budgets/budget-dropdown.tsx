'use client'
import { Button } from '@elements/button'
import { Menu, Transition } from '@headlessui/react'
import { cx } from '@utils/cx'
import Link from 'next/link'
import { Fragment } from 'react'
import { ChevronDown } from 'tabler-icons-react'

export function BudgetDropdown({
  budgets,
}: {
  budgets: { year: number; createdAt: Date; id: string }[]
}) {
  return (
    <Menu as="div" className="relative">
      <div>
        <Menu.Button as={Button} intent="secondary">
          Presupuestos
          <ChevronDown
            className="-mr-1 ml-2 h-4 w-4 text-gray-500"
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
          className="absolute right-0 z-10 mt-1 max-h-60 w-56 origin-top-right overflow-y-auto rounded-md bg-white shadow-lg ring-1  focus:outline-none"
          static
        >
          <div className="py-1">
            {budgets.map(({ id, year }) => (
              <Menu.Item key={id}>
                {({ active }) => (
                  <Link
                    scroll={false}
                    href={`/anual-budget-view/${id}`}
                    className={cx(
                      'flex w-full items-center gap-1 px-4 py-2 text-sm font-medium',
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    )}
                  >
                    Presupuesto {year}
                  </Link>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
