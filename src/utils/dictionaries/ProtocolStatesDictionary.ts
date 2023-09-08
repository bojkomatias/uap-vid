import { State } from '@prisma/client'

export default {
    [State.NOT_CREATED]: null,
    [State.DRAFT]: 'Borrador',
    [State.PUBLISHED]: 'Publicado',
    [State.METHODOLOGICAL_EVALUATION]: 'Evaluación metodológica',
    [State.SCIENTIFIC_EVALUATION]: 'Evaluación científica',
    [State.ACCEPTED]: 'Aceptado',
    [State.ON_GOING]: 'En curso',
    [State.FINISHED]: 'Finalizado',
    [State.DISCONTINUED]: 'Discontinuado',
    [State.DELETED]: 'Eliminado',
} as const
