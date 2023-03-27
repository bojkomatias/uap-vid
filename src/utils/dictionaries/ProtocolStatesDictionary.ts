import { State } from '@prisma/client'

export default {
    [State.NOT_CREATED]: null,
    [State.DRAFT]: 'Borrador',
    [State.PUBLISHED]: 'Publicado',
    [State.METHODOLOGICAL_EVALUATION]: 'En evaluación metodológica',
    [State.SCIENTIFIC_EVALUATION]: 'En evaluación científica',
    [State.ACCEPTED]: 'Aceptado',
    [State.ON_GOING]: 'Aprobado y en curso',
} as const
