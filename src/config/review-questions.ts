import { ReviewType } from '@prisma/client'

// 'SCIENTIFIC' is a union between
export const questions = [
  {
    id: '0',
    active: false,
    type: ReviewType.METHODOLOGICAL,
    question:
      '¿La propuesta se presenta redactada correctamente, está bien organizada y sigue una secuencia lógica?',
  },
  {
    id: '1',
    active: false,
    type: ReviewType.METHODOLOGICAL,
    question:
      '¿Se aprecia una relación clara entre el problema de investigación, los objetivos y las hipótesis?',
  },
  {
    id: '2',
    active: false,
    type: ReviewType.METHODOLOGICAL,
    question:
      '¿Se explicita claramente cuál será la población y cuál la muestra de estudio?',
  },
  {
    id: '3',
    active: false,
    type: ReviewType.METHODOLOGICAL,
    question:
      '¿Se presentan los instrumentos validados para medir las variables o se propone construir/adaptar y validar un instrumento? (En caso de que aplique)',
  },
  {
    id: '4',
    active: false,
    type: ReviewType.METHODOLOGICAL,
    question:
      '¿Se describen los procedimientos a seguir para la recolección de datos? (En caso de que aplique)',
  },
  {
    id: '5',
    active: false,
    type: ReviewType.METHODOLOGICAL,
    question: '¿Está bien definido el tipo de investigación?',
  },
  {
    id: '6',
    active: false,
    type: ReviewType.METHODOLOGICAL,
    question: '¿Están bien definidas las variables? (En caso de que aplique)',
  },
  {
    id: '7',
    active: false,
    type: ReviewType.METHODOLOGICAL,
    question:
      '¿Se detallan las técnicas estadísticas apropiadas para alcanzar los objetivos y probar las hipótesis? (En caso de que aplique)',
  },
  {
    id: '8',
    active: false,
    type: ReviewType.METHODOLOGICAL,
    question:
      '¿El diseño metodológico es adecuado para alcanzar los objetivos propuestos?',
  },
  {
    id: '9',
    active: false,
    type: ReviewType.METHODOLOGICAL,
    question:
      '¿La metodología propuesta parece viable de aplicar, a priori, en el tiempo programado para el desarrollo del proyecto?',
  },
  {
    id: '10',
    active: true,
    type: 'SCIENTIFIC',
    question:
      '¿La propuesta se presenta redactada correctamente, está bien organizada y sigue una secuencia lógica?',
  },
  {
    id: '10',
    active: true,
    type: 'SCIENTIFIC',
    question:
      '¿El proyecto muestra solidez interna, está fundamentado adecuadamente e incluye una revisión bibliográfica pertinente, actualizada y suficiente?',
  },
  {
    id: '11',
    active: true,
    type: 'SCIENTIFIC',
    question:
      '¿Los objetivos propuestos para el proyecto guardan una relación clara con el problema de investigación y con las descripciones y las motivaciones expuestas?',
  },
  {
    id: '12',
    active: true,
    type: 'SCIENTIFIC',
    question:
      '¿Están bien los enunciados del problema de investigación, las hipótesis y los objetivos propuestos?',
  },
  {
    id: '13',
    active: true,
    type: 'SCIENTIFIC',
    question:
      '¿En qué medida el tema de investigación expone un grado aceptable de originalidad y, por lo tanto, contribuirá al avance del conocimiento científico?',
  },
  {
    id: '14',
    active: true,
    type: 'SCIENTIFIC',
    question:
      '¿Cómo estima que será la contribución de esta investigación a la formación de recursos humanos capacitados para la investigación?',
  },
  {
    id: '15',
    active: true,
    type: 'SCIENTIFIC',
    question:
      '¿Cómo valora la contribución que esta investigación podría realizar para el desarrollo de la sociedad de la región en aspectos tales como el económico, el social, el cultural, el tecnológico o la salud?',
  },
  {
    id: '16',
    active: true,
    type: 'SCIENTIFIC',
    question:
      'En relación con las perspectivas de transferencia de los resultados: ¿Estos son adecuados?',
  },
  {
    id: '17',
    active: true,
    type: 'SCIENTIFIC',
    question:
      'En relación con las perspectivas de transferencia de los resultados: ¿Tienen una relación clara con los objetivos y las demás secciones del proyecto de investigación?',
  },
  {
    id: '18',
    active: true,
    type: 'SCIENTIFIC',
    question:
      'En relación con las perspectivas de transferencia de los resultados: ¿Los beneficios esperados están expresados con claridad?',
  },
  {
    id: '19',
    active: true,
    type: 'SCIENTIFIC',
    question:
      '¿El estudio tiene a su criterio tiene posibilidades de ser publicado en revistas científicas indexadas o en un libro?',
  },
  {
    id: '20',
    active: true,
    type: 'SCIENTIFIC',
    question:
      'Los antecedentes del director ¿Son suficientes para para desarrollar el plan de trabajo propuesto, sobre la base de su formación académica, su experiencia y la calidad de su labor en investigación?',
  },
  {
    id: '21',
    active: true,
    type: 'SCIENTIFIC',
    question:
      'Los antecedentes del codirector ¿Son suficientes para para desarrollar el plan de trabajo propuesto, sobre la base de su formación académica, su experiencia y la calidad de su labor en investigación?',
  },
  {
    id: '22',
    active: true,
    type: 'SCIENTIFIC',
    question:
      '¿El cronograma se ajusta a las acciones de investigación propuestas?',
  },
  {
    id: '23',
    active: true,
    type: 'SCIENTIFIC',
    question:
      '¿Los insumos, los materiales y los reactivos incluidos en el anteproyecto son adecuados para la realización del proyecto?',
  },
  {
    id: '24',
    active: true,
    type: 'SCIENTIFIC',
    question: '¿El presupuesto de gastos directos es adecuado?',
  },
  {
    id: '25',
    active: true,
    type: 'SCIENTIFIC',
    question:
      '¿El presupuesto de tiempo presentado responde a las demandas del proyecto?',
  },
  //Below this comment are the new questions
  {
    id: '26',
    active: true,
    type: ReviewType.METHODOLOGICAL,
    question:
      '¿La redacción del anteproyecto de investigación es clara y correcta?',
  },
  {
    id: '27',
    active: true,
    type: ReviewType.METHODOLOGICAL,
    question:
      '¿Se puede afirmar que el anteproyecto propone un desarrollo coherente y lógico?',
  },
  {
    id: '28',
    active: true,
    type: ReviewType.METHODOLOGICAL,
    question:
      '¿Se aprecia una relación clara entre el problema de investigación, el objetivo general, los objetivos específicos y las hipótesis? Se entiende que no necesariamente todos los anteproyectos deben incluir todas las categorías.',
  },
  {
    id: '29',
    active: true,
    type: ReviewType.METHODOLOGICAL,
    question:
      'Al abordar la lectura del anteproyecto, ¿queda claro de qué tipo de investigación se trata?, ¿cuantitativa, cualitativa, mixta?',
  },
  {
    id: '30',
    active: true,
    type: ReviewType.METHODOLOGICAL,
    question:
      'Considerando las características distintivas de los estudios cuantitativos y los cualitativos, ¿se explicita cuál será la población?, ¿cuáles serán los criterios de inclusión y de exclusión para integrar la muestra?, ¿qué tamaño se espera que tenga la muestra?',
  },
  {
    id: '31',
    active: true,
    type: ReviewType.METHODOLOGICAL,
    question:
      'Los instrumentos de recolección de datos, preexistentes o a diseñar, ¿satisfacen las condiciones que exige el diseño de investigación propuesto, ya sea que se trate de un estudio cuantitativo, cualitativo o mixto? (En caso de que aplique)',
  },
  {
    id: '32',
    active: true,
    type: ReviewType.METHODOLOGICAL,
    question:
      '¿Se describen detalladamente los procedimientos a seguir para la recolección de datos? (En caso de que aplique)',
  },
  {
    id: '33',
    active: true,
    type: ReviewType.METHODOLOGICAL,
    question:
      '¿Se especifican los pasos a seguir para el análisis de datos? (En caso de que aplique)',
  },
  {
    id: '34',
    active: true,
    type: ReviewType.METHODOLOGICAL,
    question:
      '¿Se explica el proceso que se aplicará para alcanzar los objetivos y probar las hipótesis, si las hubiere? (En caso de que aplique)',
  },
  {
    id: '35',
    active: true,
    type: ReviewType.METHODOLOGICAL,
    question:
      '¿El diseño metodológico es adecuado para alcanzar los objetivos propuestos?',
  },
  {
    id: '36',
    active: true,
    type: ReviewType.METHODOLOGICAL,
    question:
      '¿La justificación del estudio es suficiente para validar el desarrollo del proyecto?',
  },
  {
    id: '37',
    active: true,
    type: ReviewType.METHODOLOGICAL,
    question:
      '¿La metodología propuesta parece viable de aplicar, a priori, en el tiempo programado para el desarrollo del proyecto?',
  },
  {
    id: '38',
    active: true,
    type: ReviewType.METHODOLOGICAL,
    question:
      '¿El cronograma propuesto es consistente con la magnitud de cada etapa del estudio, incluida la de la publicación de resultados, y contiene la descripción de responsabilidades de cada investigador, en el caso de que se trate de un equipo de investigación?',
  },
]
