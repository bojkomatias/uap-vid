import { currencyFormatter } from '@utils/formatters'
import { ArrowNarrowDown, ArrowNarrowUp } from 'tabler-icons-react'
import type { BudgetSummaryType } from '@actions/anual-budget/action'
import clsx from 'clsx'

export const BudgetSummary = (
    summary: BudgetSummaryType,
    allAcademicUnits?: Boolean
) => {
    const stats = [
        {
            name: allAcademicUnits
                ? 'Presupuesto total'
                : 'Presupuesto de la UA',
            stat: summary?.totalBudget ?? 0,
            change: '12%',
            changeType: 'increase',
        },
        {
            name: 'Presupuesto proyectado',
            stat: summary?.projectedBudget ?? 0,
            change: '2.02%',
            changeType: 'increase',
        },
        {
            name: 'Presupuesto Ejecutado',
            stat: summary?.spendedBudget ?? 0,
            change: '4.05%',
            changeType: 'decrease',
        },
    ]
    return (
        <div>
            <dl className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
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
                                {currencyFormatter.format(item.stat)}

                                <span className="ml-2 text-sm font-medium text-gray-500">
                                    de 123123
                                </span>
                            </div>

                            <div
                                className={clsx(
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
