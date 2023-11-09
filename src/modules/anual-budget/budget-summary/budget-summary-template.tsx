'use client'
import { currencyFormatter } from '@utils/formatters'
import type { BudgetSummaryType } from '@actions/anual-budget/action'
import BudgetCardDelta from './budget-card-delta'
import BudgetCardDoughnut from './budget-card-doughnut'
import { useMemo, useState } from 'react'
import AnualBudgetStateDictionary from '@utils/dictionaries/AnualBudgetStateDictionary'
import { Button } from '@elements/button'
import { cx } from '@utils/cx'

export const BudgetSummary = ({
    summary,
    allAcademicUnits,
}: {
    summary: BudgetSummaryType
    allAcademicUnits?: Boolean
}) => {
    const [approved, showApproved] = useState(false)
    const stats = useMemo(
        () => [
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
                total: approved
                    ? summary?.projectedBudgetSummaryApproved?.value
                    : summary.projectedBudgetSummary.value ?? 0,
                of: summary?.academicUnitBudgetSummary.value ?? 0,
                delta: summary.projectedBudgetSummary.delta ?? 0,
                indicator: 'number',
            },
            {
                name: 'Consumo Ejecutado',
                total: summary?.spendedBudget ?? 0,
                of: approved
                    ? summary?.projectedBudgetSummaryApproved?.value
                    : summary.projectedBudgetSummary.value ?? 0,
                delta:
                    summary?.spendedBudget /
                    (approved
                        ? summary?.projectedBudgetSummaryApproved?.value
                        : summary.projectedBudgetSummary.value ?? 0),
                indicator: 'graph',
            },
        ],
        [approved]
    )
    return (
        <div>
            <dl className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
                {stats.map((item, i) => (
                    <div
                        key={item.name}
                        className="flex flex-col overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
                    >
                        <dt className="flex flex-grow justify-between text-base font-normal text-gray-900">
                            {item.name}

                            {i === 1 && (
                                <Button
                                    intent="secondary"
                                    size="xs"
                                    onClick={() =>
                                        showApproved((prev) => !prev)
                                    }
                                    className={cx(
                                        approved
                                            ? 'bg-success-200'
                                            : 'bg-warning-200'
                                    )}
                                >
                                    {approved
                                        ? AnualBudgetStateDictionary['APPROVED']
                                        : AnualBudgetStateDictionary['PENDING']}
                                </Button>
                            )}
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
                                        item.of
                                            ? (
                                                  (item.total / item.of) *
                                                  100
                                              ).toFixed(1)
                                            : '0'
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
