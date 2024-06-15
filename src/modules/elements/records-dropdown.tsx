/* eslint-disable @typescript-eslint/no-unused-vars */
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Check, ChevronDown } from 'tabler-icons-react'
import { cx } from '@utils/cx'
import { useUpdateQuery } from '@utils/query-helper/updateQuery'
import { Button } from './button'

export default function RecordsDropdown({
  options,
  shownRecords,
  currentPage,
}: {
  options: number[]
  shownRecords: number
  currentPage: number
}) {
  const update = useUpdateQuery()

  return (
    <Menu as="div" className="relative text-left">
      <div>
        <Menu.Button id="records-selector" as={Button} intent="outline">
          Cantidad de registros
          {': ' + shownRecords}
          <ChevronDown className="w-4 text-gray-500" aria-hidden="true" />
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
          className="max-h-30 absolute -top-2 right-0 z-10 mb-2 -translate-y-full transform overflow-y-auto rounded-md bg-white shadow ring-1 focus:outline-none"
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
                          o * currentPage > options.at(-1)! ? 1 : currentPage,
                      })
                    }
                    className={cx(
                      'flex w-full items-center justify-center gap-1 px-4 py-2 text-sm',
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    )}
                  >
                    {shownRecords === o ?
                      <div className="flex items-center font-bold">
                        <Check className="mr-1 h-4 w-4" />
                        {o}
                      </div>
                    : o}
                  </button>
                )}
              </Menu.Item>
            ))}
            <Menu.Item key={options.length}>
              {({ active }) => (
                <button
                  onClick={() =>
                    update({
                      records: options.at(-1),

                      page: 1,
                    })
                  }
                  className={cx(
                    ' flex w-full items-center justify-end gap-1 px-4 py-2 text-sm',
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                  )}
                >
                  {shownRecords === options.at(-1) ?
                    <div className=" flex items-center font-bold">
                      <Check className=" mr-1 h-4 w-4" />
                      Todos los registros
                    </div>
                  : <>Todos los registros</>}
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
