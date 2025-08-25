import type { BudgetSummaryType } from '@actions/anual-budget/action'
import {
  divideAmountIndexByAmountIndex,
  ZeroAmountIndex,
} from '@utils/amountIndex'
import { useMemo, useState } from 'react'

export default function useBudgetSummary({
  summary,
  allAcademicUnits,
}: {
  summary: BudgetSummaryType
  allAcademicUnits?: Boolean
}) {
  const [approved, showApproved] = useState(false)
  const stats = useMemo(() => {
    const result =
      approved ?
        [
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
              : (summary.projectedBudgetSummary.value ?? ZeroAmountIndex),
            of: summary?.academicUnitBudgetSummary.value ?? ZeroAmountIndex,
          },
          {
            name: 'Consumo ejecutado',
            total: summary?.spentBudget ?? ZeroAmountIndex,
            of:
              approved ?
                summary?.projectedBudgetSummaryApproved?.value
              : (summary.projectedBudgetSummary.value ?? ZeroAmountIndex),
            delta:
              approved ?
                divideAmountIndexByAmountIndex(
                  summary?.spentBudget,
                  summary?.projectedBudgetSummaryApproved?.value
                )
              : divideAmountIndexByAmountIndex(
                  summary?.spentBudget,
                  summary.projectedBudgetSummary.value
                ),
            indicator: 'graph',
          },
        ]
      : [
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
              : (summary.projectedBudgetSummary.value ?? ZeroAmountIndex),
            of: summary?.academicUnitBudgetSummary.value ?? ZeroAmountIndex,
          },
        ]
    return result
  }, [
    allAcademicUnits,
    approved,
    summary?.academicUnitBudgetSummary.delta,
    summary?.academicUnitBudgetSummary.value,
    summary.projectedBudgetSummary.value,
    summary?.projectedBudgetSummaryApproved?.value,
    summary?.spentBudget,
  ])
  return {
    stats,
    showApproved,
    approved,
  }
}
