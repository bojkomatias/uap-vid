import { cx } from '@utils/cx'
import Link from 'next/link'

export default function Tabs({
    params,
    tabs,
}: {
    params: { name: string }
    tabs: {
        id: string
        name: string
        shortname: string
        _count: number
    }[]
}) {
    return (
        <div className="mb-12">
            <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">
                    Select a tab
                </label>
                {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                <select
                    id="tabs"
                    title="tabs"
                    className="focus:border-indigo-500 focus:ring-indigo-500 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none sm:text-sm"
                >
                    {tabs.map((tab) => (
                        <option key={tab.shortname}>{tab.shortname}</option>
                    ))}
                </select>
            </div>
            <div className="hidden sm:block">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map(({ id, name, shortname, _count }) => (
                            <Link
                                key={id}
                                href={`/anual-budgets/${id}`}
                                title={name}
                                className={cx(
                                    'flex whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-all duration-200',
                                    id == params.name
                                        ? 'border-indigo-500 border-primary text-primary'
                                        : 'border-transparent text-gray-300 hover:border-gray-300 hover:text-gray-500'
                                )}
                            >
                                {shortname}{' '}
                                {_count ? (
                                    <span
                                        className={cx(
                                            'ml-3 hidden rounded-full px-2.5 py-0.5 text-xs font-medium md:inline-block',
                                            id == params.name
                                                ? 'bg-gray-100 text-primary'
                                                : 'bg-gray-50 text-gray-500'
                                        )}
                                    >
                                        {_count}
                                    </span>
                                ) : null}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    )
}
