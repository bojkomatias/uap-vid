import type { BudgetSummaryType } from '@actions/anual-budget/action'
import { divideAmountIndexByAmountIndex, ZeroAmountIndex } from '@utils/amountIndex'
import { useMemo, useState } from 'react'

export default function useBudgetSummary({
  summary,
  allAcademicUnits,
}: {
  summary: BudgetSummaryType
  allAcademicUnits?: Boolean
}) {
  const [approved, showApproved] = useState(false)
  const stats = useMemo(
    () => [
      {
        name:
          allAcademicUnits ? 'Presupuesto total' : (
            'Presupuesto de la Unidad Académica'
          ),
        total: summary?.academicUnitBudgetSummary.value ?? ZeroAmountIndex,
        delta: summary?.academicUnitBudgetSummary.delta,
        indicator: 'number',
      },
      {
        name: 'Consumo proyectado',
        total:
          approved ?
            summary?.projectedBudgetSummaryApproved?.value
          : summary.projectedBudgetSummary.value ?? ZeroAmountIndex,
        of: summary?.academicUnitBudgetSummary.value ?? ZeroAmountIndex,
        delta: summary.projectedBudgetSummary.delta ?? ZeroAmountIndex,
        indicator: 'number',
      },
      {
        name: 'Consumo ejecutado',
        total: summary?.spendedBudget ?? ZeroAmountIndex,
        of:
          approved ?
            summary?.projectedBudgetSummaryApproved?.value
          : summary.projectedBudgetSummary.value ?? ZeroAmountIndex,
        delta:
          approved ?
            divideAmountIndexByAmountIndex(
              summary?.spendedBudget,
              summary?.projectedBudgetSummaryApproved?.value
            )
          : divideAmountIndexByAmountIndex(
              summary?.spendedBudget,
              summary.projectedBudgetSummary.value
            ),
        indicator: 'graph',
      },
    ],
    [
      allAcademicUnits,
      approved,
      summary?.academicUnitBudgetSummary.delta,
      summary?.academicUnitBudgetSummary.value,
      summary.projectedBudgetSummary.delta,
      summary.projectedBudgetSummary.value,
      summary?.projectedBudgetSummaryApproved?.value,
      summary?.spendedBudget,
    ]
  )
  return {
    stats,
    showApproved,
    approved,
  }
}
