import { currencyFormatter } from '@utils/formatters'
import type { BudgetSummaryType } from '@actions/anual-budget/action'
import BudgetCardDelta from './budget-card-delta'
import BudgetCardDoughnut from './budget-card-doughnut'

export const BudgetSummary = (
    summary: BudgetSummaryType,
    allAcademicUnits?: Boolean
) => {
    const stats = [
        {
            name: allAcademicUnits
                ? 'Presupuesto total'
                : 'Presupuesto de la Unidad Académica',
            total: summary?.academicUnitBudgetSummary.value ?? 0,
            delta: summary?.academicUnitBudgetSummary.delta,
            date: summary?.academicUnitBudgetSummary.changeDate,
            indicator: 'number',
        },
        {
            name: 'Consumo Proyectado',
            total: summary?.projectedBudget ?? 0,
            of: summary?.academicUnitBudgetSummary.value ?? 0,
            delta: 2,
            indicator: 'number',
        },
        {
            name: 'Consumo Ejecutado',
            total: summary?.spendedBudget ?? 0,
            of: summary?.projectedBudget ?? 0,
            delta: summary?.spendedBudget / summary?.projectedBudget ?? 0,
            indicator: 'graph',
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
                            <div className="flex items-baseline text-2xl font-semibold text-black/70">
                                ${currencyFormatter.format(item.total)}
                                {item.of ? (
                                    <span className="ml-2 text-sm font-medium text-gray-500">
                                        de $
                                        {item.of
                                            ? currencyFormatter.format(item.of)
                                            : 0}
                                    </span>
                                ) : null}
                            </div>
                            {item.indicator === 'number' ? (
                                <BudgetCardDelta delta={item.delta ?? 0} />
                            ) : null}

                            {item.indicator === 'graph' ? (
                                <BudgetCardDoughnut
                                    percentage={
                                        item.of ? item.of / item.total : 0
                                    }
                                />
                            ) : null}
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    )
}
