import { AnualBudgetState } from '@prisma/client'

export const AnualBudgetStateDictionary = {
  [AnualBudgetState.APPROVED]: 'Aprobado',
  [AnualBudgetState.INTERRUPTED]: 'Interrumpido',
  [AnualBudgetState.PENDING]: 'Pendiente',
  [AnualBudgetState.REJECTED]: 'Rechazado',
} as const

export const AnualBudgetStateColorDictionary = {
  [AnualBudgetState.PENDING]: 'yellow',
  [AnualBudgetState.APPROVED]: 'teal',
  [AnualBudgetState.INTERRUPTED]: 'orange',
  [AnualBudgetState.REJECTED]: 'red',
} as const
