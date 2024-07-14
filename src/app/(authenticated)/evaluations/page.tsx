import { Heading } from '@components/heading'
import { getAllQuestionsWithTotalRecords } from '@repositories/review-question'
import EvaluationsTable from 'modules/evaluations/evaluations-table'
import React from 'react'

export default async function Page() {
  const [totalRecords, questions] = await getAllQuestionsWithTotalRecords()
  return (
    <>
      <Heading className="text-primary-950">Evaluaciones</Heading>
      <EvaluationsTable questions={questions} totalRecords={totalRecords} />
    </>
  )
}
