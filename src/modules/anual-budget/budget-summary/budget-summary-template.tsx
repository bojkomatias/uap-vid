'use client'

import type { BudgetSummaryType } from '@actions/anual-budget/action'
import { Heading } from '@components/heading'
import { Text } from '@components/text'
import type { AmountIndex } from '@prisma/client'
import useBudgetSummary from 'hooks/budgetSummary'
import { Currency } from '@shared/currency'
import Info from '@shared/info'
import { ContainerAnimations } from '@elements/container-animations'

import {
  BudgetCardDoughnut,
  BudgetCardDoughnutDark,
} from './budget-card-doughnut'

// Info content for tooltips
const INFO_CONTENT: Record<string, string> = {
  presupuestototal:
    'Presupuesto total asignado por la Vicerrectoría de Investigación y Desarrollo para proyectos de investigación en el período actual.',
  presupuestodelaUnidadAcadémica:
    'Presupuesto específico asignado a esta Unidad Académica para proyectos de investigación.',
  consumoproyectado:
    'Suma total de todos los presupuestos de proyectos (tanto aprobados como pendientes) que planean utilizarse.',
  aprobados:
    'Presupuesto total de proyectos que ya han sido aprobados y están listos para ejecutarse.',
  consumoejecutado:
    'Presupuesto que ya ha sido gastado en proyectos aprobados, incluyendo gastos directos, sueldos y otros costos.',
}

interface BudgetCardData {
  name: string
  total: AmountIndex
  of?: AmountIndex
  indicator?: string
  delta?: AmountIndex
  debugField?: string
  debugOfField?: string
}

// Helper functions
const getInfoContent = (name: string): string => {
  const key = name.replace(/\s+/g, '').toLowerCase()
  return (
    INFO_CONTENT[key] ?? 'Información sobre el presupuesto de esta categoría.'
  )
}

const calculateUsagePercentage = (
  amount: AmountIndex,
  availableBudget: AmountIndex
): number => {
  if (!availableBudget?.FCA || availableBudget.FCA === 0) return 0
  return (amount.FCA / availableBudget.FCA) * 100
}

const getBackgroundColorClass = (
  percentage: number,
  isReference: boolean = false
): string => {
  if (isReference) return ''

  if (percentage >= 85) return 'bg-red-100 dark:bg-red-900/30'
  if (percentage >= 60) return 'bg-yellow-100 dark:bg-yellow-900/30'
  return 'bg-green-100 dark:bg-green-900/30'
}

const formatPercentage = (total: AmountIndex, of: AmountIndex): string => {
  if (!of?.FCA || of.FCA === 0) return '0'
  return ((total.FCA / of.FCA) * 100).toFixed(1)
}

// Budget Card Component
interface BudgetCardProps {
  item: BudgetCardData
  referenceBudget: AmountIndex
  isReference: boolean
}

const BudgetCard = ({
  item,
  referenceBudget,
  isReference,
}: BudgetCardProps) => {
  const usagePercentage = calculateUsagePercentage(item.total, referenceBudget)
  const backgroundColorClass = getBackgroundColorClass(
    usagePercentage,
    isReference
  )
  const showGraph = item.indicator === 'graph' && item.of
  const percentage = item.of ? formatPercentage(item.total, item.of) : '0'

  return (
    <Info content={getInfoContent(item.name)} title={item.name}>
      <ContainerAnimations className="h-full" animation={3}>
        <div
          className={`flex h-full flex-col overflow-hidden rounded-lg border px-4 py-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 ${backgroundColorClass}`}
        >
          <dt className="flex flex-grow justify-between text-base font-normal text-gray-900">
            <div className="flex flex-col">
              <Heading>{item.name}</Heading>
              {!isReference && (
                <Text className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  {usagePercentage.toFixed(1)}% del presupuesto disponible
                </Text>
              )}
            </div>
          </dt>

          <dd className="relative mt-1 block items-baseline justify-between lg:flex">
            <div className="flex flex-col items-baseline text-2xl font-semibold text-black/70">
              <Currency amountIndex={item.total} />

              {item.of && (
                <Text className="ml-2 text-sm font-medium text-gray-500">
                  de <Currency amountIndex={item.of} />
                </Text>
              )}
            </div>

            {showGraph && (
              <>
                <div className="dark:hidden">
                  <BudgetCardDoughnut percentage={percentage} />
                </div>
                <div className="hidden dark:block">
                  <BudgetCardDoughnutDark percentage={percentage} />
                </div>
              </>
            )}
          </dd>
        </div>
      </ContainerAnimations>
    </Info>
  )
}

// Main Component
export const BudgetSummary = ({
  summary,
  allAcademicUnits,
}: {
  summary: BudgetSummaryType
  allAcademicUnits?: Boolean
}) => {
  const { stats } = useBudgetSummary({ summary, allAcademicUnits })

  const budgetCards: BudgetCardData[] = [
    stats[0], // Academic unit card
    stats[1], // Total projected card - already points to academic unit budget
    {
      name: 'Aprobados',
      total: summary?.projectedBudgetSummaryApproved?.value ?? stats[1].total,
      of: summary?.academicUnitBudgetSummary.value ?? { FCA: 0, FMR: 0 }, // Change to total budget instead of projected budget
    },
    {
      name: 'Consumo ejecutado',
      total: summary?.spentBudget ?? { FCA: 0, FMR: 0 },
      of: summary?.academicUnitBudgetSummary.value ?? { FCA: 0, FMR: 0 }, // Change to total budget instead of projected budget
      indicator: 'graph',
    },
  ]

  const referenceBudget = budgetCards[0].total

  return (
    <div>
      <dl className="my-8 grid grid-cols-1 gap-5 xl:grid-cols-4">
        {budgetCards.map((item, index) => (
          <BudgetCard
            key={item.name}
            item={item}
            referenceBudget={referenceBudget}
            isReference={index === 0}
          />
        ))}
      </dl>
    </div>
  )
}
