import { ProtocolState } from '@prisma/client'

export default {
  [ProtocolState.DRAFT]: 'Borrador',
  [ProtocolState.PUBLISHED]: 'Publicado',
  [ProtocolState.METHODOLOGICAL_EVALUATION]: 'Evaluación metodológica',
  [ProtocolState.SCIENTIFIC_EVALUATION]: 'Evaluación científica',
  [ProtocolState.ACCEPTED]: 'Aceptado',
  [ProtocolState.ON_GOING]: 'En curso',
  [ProtocolState.FINISHED]: 'Finalizado',
  [ProtocolState.DISCONTINUED]: 'Discontinuado',
  [ProtocolState.DELETED]: 'Eliminado',
} as const
