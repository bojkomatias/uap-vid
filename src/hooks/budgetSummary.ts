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
    // Common cards that appear in both modes
    const academicUnitCard = {
      name:
        allAcademicUnits ? 'Presupuesto total' : (
          'Presupuesto de la Unidad Académica'
        ),
      total: summary?.academicUnitBudgetSummary.value ?? ZeroAmountIndex,
      delta: summary?.academicUnitBudgetSummary.delta,
      indicator: 'number',
    }

    const totalProjectedCard = {
      name: 'Consumo proyectado (Total)',
      total: summary?.projectedBudgetSummary?.value ?? ZeroAmountIndex, // NOW: Total (pending + approved)
      of: summary?.academicUnitBudgetSummary.value ?? ZeroAmountIndex,
    }

    const spentCard = {
      name: 'Consumo ejecutado',
      total: summary?.spentBudget ?? ZeroAmountIndex,
      of: summary?.projectedBudgetSummary?.value ?? ZeroAmountIndex, // Compare to total projected
      delta: divideAmountIndexByAmountIndex(
        summary?.spentBudget,
        summary?.projectedBudgetSummary?.value
      ),
      indicator: 'graph',
    }

    // Toggle shows breakdown: Pending vs Approved
    const result =
      approved ?
        [
          academicUnitCard,
          totalProjectedCard,
          {
            name: 'Aprobados',
            total:
              summary?.projectedBudgetSummaryApproved?.value ?? ZeroAmountIndex,
            of: summary?.projectedBudgetSummary?.value ?? ZeroAmountIndex, // of total
            debugField: 'projectedBudgetSummaryApproved.value',
            debugOfField: 'projectedBudgetSummary.value (TOTAL)',
          },
          spentCard,
        ]
      : [
          academicUnitCard,
          totalProjectedCard,
          {
            name: 'Borradores',
            total:
              (summary as any)?.projectedBudgetSummaryPending?.value ??
              ZeroAmountIndex,
            of: summary?.projectedBudgetSummary?.value ?? ZeroAmountIndex, // of total
            debugField: 'projectedBudgetSummaryPending.value',
            debugOfField: 'projectedBudgetSummary.value (TOTAL)',
          },
        ]

    return result
  }, [
    allAcademicUnits,
    approved,
    summary?.academicUnitBudgetSummary.delta,
    summary?.academicUnitBudgetSummary.value,
    summary?.projectedBudgetSummary?.value,
    (summary as any)?.projectedBudgetSummaryPending?.value,
    summary?.projectedBudgetSummaryApproved?.value,
    summary?.spentBudget,
  ])
  return {
    stats,
    showApproved,
    approved,
  }
}
