import { ReviewVerdict } from '@prisma/client'

export default {
    [ReviewVerdict.NOT_REVIEWED]: 'Sin revisión',
    [ReviewVerdict.PENDING]: 'Pendiente',
    [ReviewVerdict.APPROVED]: 'Aprobado',
    [ReviewVerdict.REJECTED]: 'Desaprobado',
} as const
