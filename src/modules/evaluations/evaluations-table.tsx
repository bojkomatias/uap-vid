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
import { FormInput } from '@shared/form/form-input'
import { updateQuestionIndexes } from '@repositories/review-question'

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

  const [indexSwap, setSwapIndex] = useState({ oldIndex: 0, newIndex: 1 })

  const dragEventsHandlersMethodological = {}

  return (
    <main>
      <div className="grid grid-cols-2 gap-6">
        <section className="flex flex-col gap-3 rounded-lg border p-3 dark:border-gray-700 ">
          <div className="flex justify-between">
            {' '}
            <Heading className=" grow-0 text-primary-950">
              Evaluación metodológica
            </Heading>
            <div className="flex items-center gap-3">
              <label
                htmlFor="inactive-methodological"
                className="text-xs text-gray-600 dark:text-gray-400"
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
                      questions.filter(
                        (q) => q.type == 'METHODOLOGICAL' && q.active
                      )
                    )
                  }
                }}
                id="inactive-methodological"
                type="checkbox"
              />
            </div>
          </div>
          <FormInput
            placeholder="Buscar pregunta"
            onChange={(e: any) => {
              console.log(e.target.value.length)
              if (e.target.value.length == 0)
                return setMethodologicalQuestions(
                  questions.filter(
                    (q) => q.type == 'METHODOLOGICAL' && q.active
                  )
                )
              setMethodologicalQuestions(
                questions.filter(
                  (q) =>
                    q.type == 'METHODOLOGICAL' &&
                    q.question
                      .toLowerCase()
                      .includes(e.target.value.toLowerCase())
                )
              )
            }}
          />
          <Divider />
          <Button
            onClick={() => setNewOpen({ state: true, type: 'METHODOLOGICAL' })}
            className="my-1 w-fit font-semibold"
            intent="primary"
          >
            <Plus className="w-3" /> Nueva pregunta de evaluación
          </Button>
          <div className="flex flex-col gap-2">
            {methodologicalQuestions.map((q, i) => {
              return (
                <div key={q.id} className="truncate">
                  <Badge
                    title={q.question}
                    draggable
                    onDrag={(e) => {
                      console.log(
                        e.currentTarget
                          .closest('span')
                          ?.getAttribute('data-index')
                      )
                      setSwapIndex({
                        ...indexSwap,
                        oldIndex: Number(
                          e.currentTarget
                            .closest('span')
                            ?.getAttribute('data-index')
                        ),
                      })
                    }}
                    onDragEnter={(e) => {
                      e.currentTarget.classList.add('opacity-50')
                      setSwapIndex({
                        ...indexSwap,
                        newIndex: Number(
                          e.currentTarget
                            .closest('span')
                            ?.getAttribute('data-index')
                        ),
                      })
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove('opacity-50')
                    }}
                    onDragEnd={async (e) => {
                      ;[
                        methodologicalQuestions[indexSwap.oldIndex],
                        methodologicalQuestions[indexSwap.newIndex],
                      ] = [
                        methodologicalQuestions[indexSwap.newIndex],
                        methodologicalQuestions[indexSwap.oldIndex],
                      ]

                      const updatedMethodologicalQuestions =
                        methodologicalQuestions.map((q, i) => ({
                          ...q,
                          index: i,
                        }))
                      console.log(updatedMethodologicalQuestions)
                      await updateQuestionIndexes(
                        updatedMethodologicalQuestions
                      )
                    }}
                    data-index={i}
                    onClick={() => {
                      setOpen(true)
                      setQuestionToEdit(q)
                    }}
                    className={`w-fit cursor-pointer text-sm  ${!q.active ? 'bg-red-200 hover:bg-red-100 dark:bg-red-900/70' : 'hover:bg-gray-100'}`}
                  >
                    {i + 1}. {q.question}
                  </Badge>
                </div>
              )
            })}
          </div>
        </section>
        <section className="flex flex-col gap-3 rounded-lg border p-3 dark:border-gray-700">
          <div className="flex justify-between">
            {' '}
            <Heading className=" grow-0 text-primary-950">
              Evaluación científica
            </Heading>
            <div className="flex items-center gap-3">
              <label
                htmlFor="inactive-scientific"
                className="text-xs text-gray-600 dark:text-gray-400"
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
                      questions.filter(
                        (q) => q.type == 'SCIENTIFIC' && q.active
                      )
                    )
                  }
                }}
                id="inactive-scientific"
                type="checkbox"
              />
            </div>
          </div>
          <FormInput
            placeholder="Buscar pregunta"
            onChange={(e: any) => {
              if (e.target.value.length == 0)
                return setScientificQuestions(
                  questions.filter((q) => q.type == 'SCIENTIFIC' && q.active)
                )
              setScientificQuestions(
                questions.filter(
                  (q) =>
                    q.type == 'SCIENTIFIC' &&
                    q.question
                      .toLowerCase()
                      .includes(e.target.value.toLowerCase())
                )
              )
            }}
          />
          <Divider />
          <Button
            onClick={() => setNewOpen({ state: true, type: 'SCIENTIFIC' })}
            className="my-1 w-fit font-semibold"
            intent="primary"
          >
            <Plus className="w-3" /> Nueva pregunta de evaluación
          </Button>
          <div className="flex flex-col gap-2">
            {scientificQuestions.map((q, i) => {
              return (
                <div key={q.id} className="truncate">
                  <Badge
                    title={q.question}
                    draggable
                    onDrag={(e) => {
                      console.log(
                        e.currentTarget
                          .closest('span')
                          ?.getAttribute('data-index')
                      )
                      setSwapIndex({
                        ...indexSwap,
                        oldIndex: Number(
                          e.currentTarget
                            .closest('span')
                            ?.getAttribute('data-index')
                        ),
                      })
                    }}
                    onDragEnter={(e) => {
                      e.currentTarget.classList.add('opacity-50')
                      setSwapIndex({
                        ...indexSwap,
                        newIndex: Number(
                          e.currentTarget
                            .closest('span')
                            ?.getAttribute('data-index')
                        ),
                      })
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove('opacity-50')
                    }}
                    onDragEnd={async (e) => {
                      ;[
                        scientificQuestions[indexSwap.oldIndex],
                        scientificQuestions[indexSwap.newIndex],
                      ] = [
                        scientificQuestions[indexSwap.newIndex],
                        scientificQuestions[indexSwap.oldIndex],
                      ]

                      const updatedScientificQuestions =
                        scientificQuestions.map((q, i) => ({
                          ...q,
                          index: i,
                        }))
                      console.log(updatedScientificQuestions)
                      await updateQuestionIndexes(updatedScientificQuestions)
                    }}
                    data-index={i}
                    onClick={() => {
                      setOpen(true)
                      setQuestionToEdit(q)
                    }}
                    className={`w-fit cursor-pointer text-sm  ${!q.active ? 'bg-red-200 hover:bg-red-100 dark:bg-red-900/70' : 'hover:bg-gray-100'}`}
                  >
                    {i + 1}. {q.question}
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
