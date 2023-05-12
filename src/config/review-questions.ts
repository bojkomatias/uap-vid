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
        type: ReviewType.METHODOLOGICAL,
        question:
            '¿Se aprecia una relación clara entre el problema de investigación, los objetivos y las hipótesis?',
    },
    {
        id: '2',
        type: ReviewType.METHODOLOGICAL,
        question:
            '¿Se explicita claramente cuál será la población y cuál la muestra de estudio?',
    },
    {
        id: '3',
        type: ReviewType.METHODOLOGICAL,
        question:
            '¿Se presentan los instrumentos validados para medir las variables o se propone construir/adaptar y validar un instrumento? (En caso de que aplique)',
    },
    {
        id: '4',
        type: ReviewType.METHODOLOGICAL,
        question:
            '¿Se describen los procedimientos a seguir para la recolección de datos? (En caso de que aplique)',
    },
    {
        id: '5',
        type: ReviewType.METHODOLOGICAL,
        question: '¿Está bien definido el tipo de investigación?',
    },
    {
        id: '6',
        type: ReviewType.METHODOLOGICAL,
        question:
            '¿Están bien definidas las variables? (En caso de que aplique)',
    },
    {
        id: '7',
        type: ReviewType.METHODOLOGICAL,
        question:
            '¿Se detallan las técnicas estadísticas apropiadas para alcanzar los objetivos y probar las hipótesis? (En caso de que aplique)',
    },
    {
        id: '8',
        type: ReviewType.METHODOLOGICAL,
        question:
            '¿El diseño metodológico es adecuado para alcanzar los objetivos propuestos?',
    },
    {
        id: '9',
        type: ReviewType.METHODOLOGICAL,
        question:
            '¿La metodología propuesta parece viable de aplicar, a priori, en el tiempo programado para el desarrollo del proyecto?',
    },

    {
        id: '1',
        type: 'SCIENTIFIC',
        question:
            '¿La propuesta se presenta redactada correctamente, está bien organizada y sigue una secuencia lógica?',
    },
]
