import { ReviewVerdict } from '@prisma/client'

export default {
    [ReviewVerdict.PENDING]: 'Pendiente',
    [ReviewVerdict.APPROVED]: 'Aprobado',
    [ReviewVerdict.REJECTED]: 'Rechazado',
} as const
