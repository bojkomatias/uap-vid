import { Heading, Subheading } from '@components/heading'
import { getAllQuestionsWithTotalRecords } from '@repositories/review-question'
import EvaluationsTable from 'modules/evaluations/evaluations-table'
import React from 'react'

export default async function Page() {
  const [totalRecords, questions] = await getAllQuestionsWithTotalRecords()
  return (
    <>
      <Heading className="text-primary-950">Evaluaciones</Heading>
      <Subheading className="mb-3">
        Listado de preguntas correspondientes a cada tipo de evaluación. Las
        preguntas activas son las que los evaluadores (metodólogo, evaluador
        interno, externo o extraordinario) utlilizan para evaluar un protocolo
        de investigación. Para remover una pregunta de la evaluación, marque su
        estado como inactivo. Esta acción no eliminará la pregunta, ya que
        existe la posibilidad de que un protocolo haya sido evaluado previamente
        con esa pregunta.
      </Subheading>
      <EvaluationsTable questions={questions} totalRecords={totalRecords} />
    </>
  )
}
