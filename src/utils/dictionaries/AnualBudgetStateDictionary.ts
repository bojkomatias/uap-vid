import { AnualBudgetState } from '@prisma/client'

export const AnualBudgetStateDictionary = {
  [AnualBudgetState.APPROVED]: 'Aprobado',
  [AnualBudgetState.INTERRUPTED]: 'Interrumpido',
  [AnualBudgetState.PENDING]: 'Borrador',
  [AnualBudgetState.REJECTED]: 'Rechazado', // No existe mas
} as const

export const AnualBudgetStateColorDictionary = {
  [AnualBudgetState.PENDING]: 'yellow',
  [AnualBudgetState.APPROVED]: 'teal',
  [AnualBudgetState.INTERRUPTED]: 'orange',
  [AnualBudgetState.REJECTED]: 'red', // No existe mas
} as const
