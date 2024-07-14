'use client'

import type { ReviewQuestion } from '@prisma/client'
import React, { useRef, useState } from 'react'
import { Badge } from '@components/badge'
import { Heading, Subheading } from '@components/heading'
import { Divider } from '@components/divider'
import { Dialog } from '@components/dialog'
import { FormInput } from '@shared/form/form-input'
import { Fieldset } from '@components/fieldset'
import { FormSwitch } from '@shared/form/form-switch'
import { useForm, zodResolver } from '@mantine/form'
import { ReviewQuestionSchema } from '@utils/zod'
import { z } from 'zod'

export default function EvaluationsTable({
  questions,
  totalRecords,
}: {
  questions: ReviewQuestion[]
  totalRecords: number
}) {
  const [open, setOpen] = useState(false)
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

  const form = useForm<z.infer<typeof ReviewQuestionSchema>>({
    initialValues: {
      active: questionToEdit.active,
      type: questionToEdit.type,
      question: questionToEdit.question,
    },
    validate: zodResolver(ReviewQuestionSchema),
  })

  return (
    <main>
      <Subheading className="mb-3">
        Listado de preguntas correspondientes a cada tipo de evaluación. Las
        preguntas activas son las que los evaluadores (metodólogo, evaluador
        interno, externo o extraordinario) utlilizan para evaluar un protocolo
        de investigación. Para remover una pregunta de la evaluación, marque su
        estado como inactivo. Esta acción no eliminará la pregunta, ya que
        existe la posibilidad de que un protocolo haya sido evaluado previamente
        con esa pregunta.
      </Subheading>
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
        <form>
          <Fieldset>
            <div>
              <FormSwitch
                label="Estado de la pregunta"
                description={
                  form.getInputProps('active').value ? 'Activa' : 'Inactiva'
                }
                checked={form.getInputProps('active').value}
                {...form.getInputProps('active')}
                onChange={() => {
                  console.log(form.getInputProps('active'))
                }}
              />{' '}
            </div>
            <FormInput
              value={form.getInputProps('question').value}
              description="Editar pregunta"
              label="Texto de la pregunta"
              {...form.getInputProps('question')}
            />
          </Fieldset>
        </form>
      </Dialog>
    </main>
  )
}
