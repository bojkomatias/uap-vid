'use client'
import type { BudgetSummaryType } from '@actions/anual-budget/action'
import BudgetCardDelta from './budget-card-delta'
import AnualBudgetStateDictionary from '@utils/dictionaries/AnualBudgetStateDictionary'
import { Button } from '@elements/button'
import { cx } from '@utils/cx'
import type { AmountIndex } from '@prisma/client'
import { AnualBudgetState } from '@prisma/client'
import useBudgetSummary from 'hooks/budgetSummaryHook'
import { Currency } from '@shared/currency'
import Info from 'modules/info'
import { BudgetCardDoughnut } from './budget-card-doughnut'

export const BudgetSummary = ({
  summary,
  allAcademicUnits,
}: {
  summary: BudgetSummaryType
  allAcademicUnits?: Boolean
}) => {
  const { approved, showApproved, stats } = useBudgetSummary({
    summary,
    allAcademicUnits,
  })

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
      <dl
        className={`mt-5 grid grid-cols-1 gap-5 ${approved ? 'xl:grid-cols-3' : 'xl:grid-cols-2'}`}
      >
        {stats.map((item, i) => (
          <Info
            content={
              info_content[item.name.replace(' ', '').toLowerCase()] ??
              'Presupuesto que corresponde a la Unidad Académica de la pestaña seleccionada.'
            }
            title={item.name}
            key={item.name}
          >
            <dt className="flex flex-grow justify-between text-base font-normal text-gray-900">
              {item.name}

              {i === 1 && (
                <Button
                  intent="secondary"
                  size="xs"
                  onClick={() => showApproved((prev) => !prev)}
                  className={cx(approved ? 'bg-success-200' : 'bg-warning-200')}
                >
                  {approved ?
                    AnualBudgetStateDictionary[AnualBudgetState.APPROVED]
                  : AnualBudgetStateDictionary[AnualBudgetState.PENDING]}
                </Button>
              )}
            </dt>
            <dd className="relative mt-1 block items-baseline justify-between lg:flex">
              <div className="flex flex-col items-baseline text-2xl font-semibold text-black/70">
                <Currency amountIndex={item.total} />
                {item.of ?
                  <span className="ml-2 text-sm font-medium text-gray-500">
                    de
                    {item.of ?
                      <Currency amountIndex={item.of} />
                    : 0}
                  </span>
                : null}
              </div>

              {approved && item.indicator === 'graph' ?
                // All the indexes must be percentually the same
                <BudgetCardDoughnut
                  percentage={
                    item.of ?
                      (
                        (item.total.FCA / (item.of as AmountIndex).FCA) *
                        100
                      ).toFixed(1)
                    : '0'
                  }
                />
              : null}
            </dd>
          </Info>
        ))}
      </dl>
    </div>
  )
}
