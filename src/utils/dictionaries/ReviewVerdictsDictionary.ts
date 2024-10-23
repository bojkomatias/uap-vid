import { ReviewVerdict } from '@prisma/client'

export const ReviewVerdictDictionary = {
  [ReviewVerdict.NOT_REVIEWED]: 'Sin revisión',
  [ReviewVerdict.APPROVED_WITH_CHANGES]: 'Aprobado con cambios',
  [ReviewVerdict.APPROVED]: 'Aprobado',
  [ReviewVerdict.REJECTED]: 'Desaprobado',
} as const

export const ReviewVerdictColorDictionary = {
  [ReviewVerdict.NOT_REVIEWED]: 'gray',
  [ReviewVerdict.APPROVED_WITH_CHANGES]: 'amber',
  [ReviewVerdict.APPROVED]: 'green',
  [ReviewVerdict.REJECTED]: 'rose',
} as const
