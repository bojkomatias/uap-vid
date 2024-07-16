'use client'

import type { ReviewQuestion } from '@prisma/client'
import React, { useRef, useState } from 'react'
import { Badge } from '@components/badge'
import { Heading } from '@components/heading'
import { Divider } from '@components/divider'
import { Dialog, DialogTitle } from '@components/dialog'
import UpdateQuestionForm from './question-form'
import NewQuestionForm from './new-question.form'
import { Button } from '@elements/button'
import { Plus } from 'tabler-icons-react'

export default function EvaluationsTable({
  questions,
  totalRecords,
}: {
  questions: ReviewQuestion[]
  totalRecords: number
}) {
  const [open, setOpen] = useState(false)
  const [newOpen, setNewOpen] = useState({ state: false, type: '' })
  const [questionToEdit, setQuestionToEdit] = useState<ReviewQuestion>(
    questions[0]
  )
  const [methodologicalQuestions, setMethodologicalQuestions] = useState(
    questions.filter((q) => q.type == 'METHODOLOGICAL')!.filter((q) => q.active)
  )
  const [scientificQuestions, setScientificQuestions] = useState(
    questions.filter((q) => q.type != 'METHODOLOGICAL')!.filter((q) => q.active)
  )

  const methodologicalCheckbox = useRef<HTMLInputElement>(null)
  const scientificCheckbox = useRef<HTMLInputElement>(null)

  const handleNewClose = () => {
    setNewOpen((prevState) => ({ ...prevState, state: false }))
  }

  return (
    <main>
      <div className="grid grid-cols-2 gap-6">
        <section className="flex flex-col gap-3 rounded-lg border p-3">
          <div className="flex justify-between">
            {' '}
            <Heading className=" grow-0 text-primary-950">
              Evaluación metodológica
            </Heading>
            <div className="flex items-center gap-3">
              <label
                htmlFor="inactive-methodological"
                className="text-xs text-gray-600"
              >
                Mostrar preguntas inactivas
              </label>
              <input
                ref={methodologicalCheckbox}
                onChange={() => {
                  if (methodologicalCheckbox.current?.checked) {
                    setMethodologicalQuestions(
                      questions.filter((q) => q.type == 'METHODOLOGICAL')!
                    )
                  } else if (methodologicalCheckbox.current?.checked == false) {
                    setMethodologicalQuestions(
                      questions
                        .filter((q) => q.type == 'METHODOLOGICAL')!
                        .filter((q) => q.active)
                    )
                  }
                }}
                id="inactive-methodological"
                type="checkbox"
              />
            </div>
          </div>
          <Divider />
          <Button
            onClick={() => setNewOpen({ state: true, type: 'METHODOLOGICAL' })}
            className="my-1 w-fit font-semibold"
            intent="primary"
          >
            <Plus className="w-3" /> Nueva pregunta de evaluación
          </Button>
          <div className="flex flex-col gap-2">
            {methodologicalQuestions.map((q) => {
              return (
                <div key={q.id} className="truncate">
                  <Badge
                    onClick={() => {
                      setOpen(true)
                      setQuestionToEdit(q)
                    }}
                    className={`w-fit cursor-pointer text-sm  ${!q.active ? 'bg-red-200 hover:bg-red-100' : 'hover:bg-gray-100'}`}
                  >
                    {q.question}
                  </Badge>
                </div>
              )
            })}
          </div>
        </section>
        <section className="flex flex-col gap-3 rounded-lg border p-3">
          <div className="flex justify-between">
            {' '}
            <Heading className=" grow-0 text-primary-950">
              Evaluación científica
            </Heading>
            <div className="flex items-center gap-3">
              <label
                htmlFor="inactive-scientific"
                className="text-xs text-gray-600"
              >
                Mostrar preguntas inactivas
              </label>
              <input
                ref={scientificCheckbox}
                onChange={() => {
                  if (scientificCheckbox.current?.checked) {
                    setScientificQuestions(
                      questions.filter((q) => q.type == 'SCIENTIFIC')!
                    )
                  } else if (scientificCheckbox.current?.checked == false) {
                    setScientificQuestions(
                      questions
                        .filter((q) => q.type == 'SCIENTIFIC')!
                        .filter((q) => q.active)
                    )
                  }
                }}
                id="inactive-scientific"
                type="checkbox"
              />
            </div>
          </div>
          <Divider />
          <Button
            onClick={() => setNewOpen({ state: true, type: 'SCIENTIFIC' })}
            className="my-1 w-fit font-semibold"
            intent="primary"
          >
            <Plus className="w-3" /> Nueva pregunta de evaluación
          </Button>
          <div className="flex flex-col gap-2">
            {scientificQuestions.map((q) => {
              return (
                <div key={q.id} className="truncate">
                  <Badge
                    onClick={() => {
                      setOpen(true)
                      setQuestionToEdit(q)
                    }}
                    className={`w-fit cursor-pointer text-sm  ${!q.active ? 'bg-red-200 hover:bg-red-100' : 'hover:bg-gray-100'}`}
                  >
                    {q.question}
                  </Badge>
                </div>
              )
            })}
          </div>
        </section>
      </div>
      <Dialog open={open} onClose={setOpen}>
        <DialogTitle>Actualizar pregunta</DialogTitle>
        <UpdateQuestionForm question={questionToEdit} />
      </Dialog>
      <Dialog open={newOpen.state} onClose={handleNewClose}>
        <DialogTitle>Crear pregunta de evaluación</DialogTitle>
        <NewQuestionForm type={newOpen.type} />
      </Dialog>
    </main>
  )
}
