import { AnualBudgetState } from '@prisma/client'

export default {
  [AnualBudgetState.APPROVED]: 'Aprobado',
  [AnualBudgetState.INTERRUPTED]: 'Interrumpido',
  [AnualBudgetState.PENDING]: 'Pendiente',
  [AnualBudgetState.REJECTED]: 'Rechazado',
} as const
