'use client'
import { currencyFormatter } from '@utils/formatters'
import type { BudgetSummaryType } from '@actions/anual-budget/action'
import BudgetCardDelta from './budget-card-delta'
import { useMemo, useState } from 'react'
import { Heading, Subheading } from '@components/heading'
import {
  BudgetCardDoughnut,
  BudgetCardDoughnutDark,
} from './budget-card-doughnut'
import Info from 'modules/info'

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
        name:
          allAcademicUnits ? 'Presupuesto total' : (
            'Presupuesto de la Unidad Académica'
          ),
        total: summary?.academicUnitBudgetSummary.value ?? 0,
        delta: summary?.academicUnitBudgetSummary.delta,
        date: summary?.academicUnitBudgetSummary.changeDate,
        indicator: 'number',
      },
      {
        name: 'Consumo proyectado',
        total:
          approved ?
            summary?.projectedBudgetSummaryApproved?.value
          : (summary.projectedBudgetSummary.value ?? 0),
        of: summary?.academicUnitBudgetSummary.value ?? 0,
        delta: summary.projectedBudgetSummary.delta ?? 0,
        indicator: 'number',
      },
      {
        name: 'Consumo ejecutado',
        total: summary?.spendedBudget ?? 0,
        of:
          approved ?
            summary?.projectedBudgetSummaryApproved?.value
          : (summary.projectedBudgetSummary.value ?? 0),
        delta:
          summary?.spendedBudget /
          (approved ?
            summary?.projectedBudgetSummaryApproved?.value
          : (summary.projectedBudgetSummary.value ?? 0)),
        indicator: 'graph',
      },
    ],
    [
      allAcademicUnits,
      approved,
      summary?.academicUnitBudgetSummary.changeDate,
      summary?.academicUnitBudgetSummary.delta,
      summary?.academicUnitBudgetSummary.value,
      summary.projectedBudgetSummary.delta,
      summary.projectedBudgetSummary.value,
      summary?.projectedBudgetSummaryApproved?.value,
      summary?.spendedBudget,
    ]
  )

  const info_content: { [key: string]: string } = {
    presupuestototal:
      'El presupuesto total de la Vicerrectoría de Investigación y Desarrollo destinado a proyectos de investigación.',
    consumoproyectado:
      'Sumatoria de todos los presupuestos aprobados hasta el momento.',
    consumoejecutado:
      'Sumatoria de ejecuciones realizadas en todos los presupuestos. Para cada presupuesto aprobado, se realizan ejecuciones (gastos directos, sueldos, etc), cuando estas se realizan, es un consumo ejecutado.',
  }

  return (
    <div>
      <dl className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {stats.map((item, i) => (
          <Info
            content={
              info_content[item.name.replace(' ', '').toLowerCase()] ??
              'Presupuesto que corresponde a la Unidad Académica de la pestaña seleccionada.'
            }
            title={item.name}
            key={item.name}
          >
            <div className="flex flex-col overflow-hidden rounded-lg border px-4 py-5 shadow-md dark:border-gray-700 dark:bg-gray-800 sm:p-6">
              <dt className="flex flex-grow justify-between text-base font-normal text-gray-900">
                <Heading>{item.name}</Heading>
              </dt>
              <dd className="relative mt-1 block items-baseline justify-between lg:flex">
                <Subheading className="flex items-baseline text-2xl font-semibold text-black/70">
                  {currencyFormatter.format(item.total)}
                  {item.of ?
                    <span className="ml-2 text-sm font-medium text-gray-500">
                      de {item.of ? currencyFormatter.format(item.of) : 0}
                    </span>
                  : null}
                </Subheading>
                {item.indicator === 'number' ?
                  <BudgetCardDelta delta={item.delta ?? 0} />
                : null}

                {item.indicator === 'graph' ?
                  <>
                    <div className="dark:hidden">
                      {' '}
                      <BudgetCardDoughnut
                        percentage={
                          item.of ?
                            ((item.total / item.of) * 100).toFixed(1)
                          : '0'
                        }
                      />
                    </div>
                    <div className="hidden dark:block">
                      <BudgetCardDoughnutDark
                        percentage={
                          item.of ?
                            ((item.total / item.of) * 100).toFixed(1)
                          : '0'
                        }
                      />
                    </div>
                  </>
                : null}
              </dd>
            </div>
          </Info>
        ))}
      </dl>
    </div>
  )
}
