import { ReviewType } from '@prisma/client'

// 'SCIENTIFIC' is a union between
export const questions = [
    {
        id: '0',
        type: ReviewType.METHODOLOGICAL,
        question:
            '¿La propuesta se presenta redactada correctamente, está bien organizada y sigue una secuencia lógica?',
    },
    {
        id: '1',
        type: 'SCIENTIFIC',
        question:
            '¿La propuesta se presenta redactada correctamente, está bien organizada y sigue una secuencia lógica?',
    },
]
