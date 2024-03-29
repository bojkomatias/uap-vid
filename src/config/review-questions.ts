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
        id: '10',
        type: 'SCIENTIFIC',
        question:
            '¿La propuesta se presenta redactada correctamente, está bien organizada y sigue una secuencia lógica?',
    },
    {
        id: '10',
        type: 'SCIENTIFIC',
        question:
            '¿El proyecto muestra solidez interna, está fundamentado adecuadamente e incluye una revisión bibliográfica pertinente, actualizada y suficiente?',
    },
    {
        id: '11',
        type: 'SCIENTIFIC',
        question:
            '¿Los objetivos propuestos para el proyecto guardan una relación clara con el problema de investigación y con las descripciones y las motivaciones expuestas?',
    },
    {
        id: '12',
        type: 'SCIENTIFIC',
        question:
            '¿Están bien los enunciados del problema de investigación, las hipótesis y los objetivos propuestos?',
    },
    {
        id: '13',
        type: 'SCIENTIFIC',
        question:
            '¿En qué medida el tema de investigación expone un grado aceptable de originalidad y, por lo tanto, contribuirá al avance del conocimiento científico?',
    },
    {
        id: '14',
        type: 'SCIENTIFIC',
        question:
            '¿Cómo estima que será la contribución de esta investigación a la formación de recursos humanos capacitados para la investigación?',
    },
    {
        id: '15',
        type: 'SCIENTIFIC',
        question:
            '¿Cómo valora la contribución que esta investigación podría realizar para el desarrollo de la sociedad de la región en aspectos tales como el económico, el social, el cultural, el tecnológico o la salud?',
    },
    {
        id: '16',
        type: 'SCIENTIFIC',
        question:
            'En relación con las perspectivas de transferencia de los resultados: ¿Estos son adecuados?',
    },
    {
        id: '17',
        type: 'SCIENTIFIC',
        question:
            'En relación con las perspectivas de transferencia de los resultados: ¿Tienen una relación clara con los objetivos y las demás secciones del proyecto de investigación?',
    },
    {
        id: '18',
        type: 'SCIENTIFIC',
        question:
            'En relación con las perspectivas de transferencia de los resultados: ¿Los beneficios esperados están expresados con claridad?',
    },
    {
        id: '19',
        type: 'SCIENTIFIC',
        question:
            '¿El estudio tiene a su criterio tiene posibilidades de ser publicado en revistas científicas indexadas o en un libro?',
    },
    {
        id: '20',
        type: 'SCIENTIFIC',
        question:
            'Los antecedentes del director ¿Son suficientes para para desarrollar el plan de trabajo propuesto, sobre la base de su formación académica, su experiencia y la calidad de su labor en investigación?',
    },
    {
        id: '21',
        type: 'SCIENTIFIC',
        question:
            'Los antecedentes del codirector ¿Son suficientes para para desarrollar el plan de trabajo propuesto, sobre la base de su formación académica, su experiencia y la calidad de su labor en investigación?',
    },
    {
        id: '22',
        type: 'SCIENTIFIC',
        question:
            '¿El cronograma se ajusta a las acciones de investigación propuestas?',
    },
    {
        id: '23',
        type: 'SCIENTIFIC',
        question:
            '¿Los insumos, los materiales y los reactivos incluidos en el anteproyecto son adecuados para la realización del proyecto?',
    },
    {
        id: '24',
        type: 'SCIENTIFIC',
        question: '¿El presupuesto de gastos directos es adecuado?',
    },
    {
        id: '25',
        type: 'SCIENTIFIC',
        question:
            '¿El presupuesto de tiempo presentado responde a las demandas del proyecto?',
    },
]
