import { ProtocolState } from '@prisma/client'

export const ProtocolStatesDictionary = {
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

export const ProtocolStatesColorDictionary = {
  [ProtocolState.DRAFT]: 'gray',
  [ProtocolState.PUBLISHED]: 'cyan',
  [ProtocolState.METHODOLOGICAL_EVALUATION]: 'emerald',
  [ProtocolState.SCIENTIFIC_EVALUATION]: 'fuchsia',
  [ProtocolState.ACCEPTED]: 'indigo',
  [ProtocolState.ON_GOING]: 'lime',
  [ProtocolState.FINISHED]: 'teal',
  [ProtocolState.DISCONTINUED]: 'light',
  [ProtocolState.DELETED]: 'red',
} as const
