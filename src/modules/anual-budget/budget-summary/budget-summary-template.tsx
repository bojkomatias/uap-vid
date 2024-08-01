'use client'

import type { BudgetSummaryType } from '@actions/anual-budget/action'
import { Heading } from '@components/heading'
import { AnualBudgetStateDictionary } from '@utils/dictionaries/AnualBudgetStateDictionary'
import type { AmountIndex } from '@prisma/client'
import { AnualBudgetState } from '@prisma/client'
import useBudgetSummary from 'hooks/budgetSummaryHook'
import { Currency } from '@shared/currency'
import Info from 'modules/info'
import {
  BudgetCardDoughnut,
  BudgetCardDoughnutDark,
} from './budget-card-doughnut'
import { Text } from '@components/text'
import { BadgeButton } from '@components/badge'
import { ContainerAnimations } from '@elements/container-animations'

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
        className={`my-8 grid grid-cols-1 gap-5 ${approved ? 'xl:grid-cols-3' : 'xl:grid-cols-2'}`}
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
            <ContainerAnimations className="h-full" animation={3}>
              <div className="flex h-full flex-col overflow-hidden rounded-lg border px-4 py-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                <dt className="flex flex-grow justify-between text-base font-normal text-gray-900">
                  <Heading>{item.name}</Heading>

                  {i === 1 && (
                    <BadgeButton
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation()
                        showApproved((prev) => !prev)
                      }}
                      color={approved ? 'teal' : 'yellow'}
                    >
                      {approved ?
                        AnualBudgetStateDictionary[AnualBudgetState.APPROVED]
                      : AnualBudgetStateDictionary[AnualBudgetState.PENDING]}
                    </BadgeButton>
                  )}
                </dt>

                <dd className="relative mt-1 block items-baseline justify-between lg:flex">
                  <div className="flex flex-col items-baseline text-2xl font-semibold text-black/70">
                    <Currency amountIndex={item.total} />
                    {item.of ?
                      <Text className="ml-2 text-sm font-medium text-gray-500">
                        de
                        {item.of ?
                          <Currency amountIndex={item.of} />
                        : 0}
                      </Text>
                    : null}
                  </div>
                  <div className="dark:hidden">
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
                  </div>
                  <div className="hidden dark:block">
                    {' '}
                    {approved && item.indicator === 'graph' ?
                      // All the indexes must be percentually the same
                      <BudgetCardDoughnutDark
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
                  </div>
                </dd>
              </div>
            </ContainerAnimations>
          </Info>
        ))}
      </dl>
    </div>
  )
}
