import { ReviewVerdict } from '@prisma/client'

export default {
    [ReviewVerdict.NOT_REVIEWED]: 'Sin revisión',
    [ReviewVerdict.APPROVED_WITH_CHANGES]: 'Aprobado con cambios',
    [ReviewVerdict.APPROVED]: 'Aprobado',
    [ReviewVerdict.REJECTED]: 'Desaprobado',
} as const
