import type { TotalBudgetCalculation } from '@utils/anual-budget'
import { currencyFormatter } from '@utils/formatters'
import { ArrowNarrowDown, ArrowNarrowUp } from 'tabler-icons-react'

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}
export const BudgetSummary = ({
    ABIe,
    ABTe,
    ABIr,
    ABTr,
    total,
}: TotalBudgetCalculation) => {
    const stats = [
        {
            name: 'Total Subscribers',
            stat: '71,897',
            previousStat: '70,946',
            change: '12%',
            changeType: 'increase',
        },
        {
            name: 'Avg. Open Rate',
            stat: '58.16%',
            previousStat: '56.14%',
            change: '2.02%',
            changeType: 'increase',
        },
        {
            name: 'Avg. Click Rate',
            stat: '24.57%',
            previousStat: '28.62%',
            change: '4.05%',
            changeType: 'decrease',
        },
        {
            name: 'Avg. Click Rate',
            stat: '24.57%',
            previousStat: '28.62%',
            change: '4.05%',
            changeType: 'decrease',
        },
    ]
    return (
        <div>
            <dl className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-4">
                {stats.map((item) => (
                    <div
                        key={item.name}
                        className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
                    >
                        <dt className="text-base font-normal text-gray-900">
                            {item.name}
                        </dt>
                        <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                            <div className="text-indigo-600 flex items-baseline text-2xl font-semibold">
                                {item.stat}
                                <span className="ml-2 text-sm font-medium text-gray-500">
                                    from {item.previousStat}
                                </span>
                            </div>

                            <div
                                className={classNames(
                                    item.changeType === 'increase'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800',
                                    'inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0'
                                )}
                            >
                                {item.changeType === 'increase' ? (
                                    <ArrowNarrowUp
                                        className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-success-600"
                                        aria-hidden="true"
                                    />
                                ) : (
                                    <ArrowNarrowDown
                                        className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-error-700"
                                        aria-hidden="true"
                                    />
                                )}

                                <span className="sr-only">
                                    {' '}
                                    {item.changeType === 'increase'
                                        ? 'Increased'
                                        : 'Decreased'}{' '}
                                    by{' '}
                                </span>
                                {item.change}
                            </div>
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    )
}
