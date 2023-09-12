import { useParams } from 'next/navigation'

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Tabs({
    params,
    tabs,
    iconOrWhateverYouWant,
}: {
    params: { name: string }
    tabs: {
        title: string
        extendedTitle?: string
        href: string
        count?: string
    }[]
    iconOrWhateverYouWant?: React.ReactNode
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
                        <option key={tab.title}>{tab.title}</option>
                    ))}
                </select>
            </div>
            <div className="hidden sm:block">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <a
                                key={tab.title}
                                href={tab.href}
                                className={classNames(
                                    tab.extendedTitle ==
                                        decodeURIComponent(params.name)
                                        ? 'border-indigo-500 border-primary text-primary'
                                        : 'border-transparent text-gray-300 hover:border-gray-300 hover:text-gray-500',
                                    'flex whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-all duration-200'
                                )}
                            >
                                {tab.title}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    )
}
