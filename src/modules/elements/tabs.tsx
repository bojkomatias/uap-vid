'use client'
import { cx } from '@utils/cx'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

const inactive_tab_styles =
  'border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-600 dark:text-gray-500 hover:bg-gray-200/60 dark:hover:bg-primary/40 dark:hover:text-gray-200 z-10'
const active_tab_styles =
  'border-primary bg-gray-300/50 text-primary shadow-[5px_3px_5px_0px_#dfdfdf] dark:shadow-[5px_3px_5px_0px_#1a202c] dark:border-white dark:bg-primary-950/40 dark:text-white z-20'

export default function Tabs({
  tabs,
}: {
  tabs: {
    id: string
    name: string
    shortname: string
    _count: number
  }[]
}) {
  const segment = useSelectedLayoutSegment()

  return (
    <div className="mb-4">
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          title="tabs"
          className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none sm:text-sm"
        >
          {tabs.map((tab) => (
            <option key={tab.shortname}>{tab.shortname}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px mt-2 flex" aria-label="Tabs">
            <Link
              href={`/anual-budgets`}
              title={'Mostrar todos los presupuestos'}
              className={cx(
                'flex whitespace-nowrap rounded-t-md border-b-2 px-5 py-3 text-sm font-medium transition-all duration-200 ',
                segment == null ? active_tab_styles : inactive_tab_styles
              )}
            >
              TODOS
            </Link>
            {tabs.map(({ id, name, shortname, _count }) => (
              <Link
                key={id}
                href={`/anual-budgets/${id}`}
                title={name}
                className={cx(
                  'group flex whitespace-nowrap rounded-t-md border-b-2 px-5 py-3 text-sm font-medium transition-all duration-200 ',
                  segment == id ? active_tab_styles : inactive_tab_styles
                )}
              >
                {shortname}{' '}
                {_count ?
                  <span
                    className={cx(
                      'ml-3 hidden rounded-full px-2.5 py-0.5 text-xs font-medium md:inline-block',
                      segment == id ?
                        'bg-gray-100 text-primary dark:bg-gray-400/50 dark:text-white'
                      : 'bg-gray-200 text-gray-500 dark:bg-gray-600/50 dark:group-hover:bg-gray-500/50 dark:group-hover:text-white'
                    )}
                  >
                    {_count}
                  </span>
                : null}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
