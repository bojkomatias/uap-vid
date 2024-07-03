'use client'
import { motion } from 'framer-motion'
import { useProtocolContext } from '@utils/createContext'
import { Plus, Trash } from 'tabler-icons-react'
import {
  Description,
  Field,
  Fieldset,
  Label,
  Legend,
} from '@components/fieldset'
import { Text } from '@components/text'
import { FormInput } from '@shared/form/form-input'
import { Fragment } from 'react'
import { Button } from '@components/button'

export function BibliographyForm() {
  const form = useProtocolContext()

  return (
    <motion.div
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
    >
      <Fieldset>
        <Legend>Bibliografía</Legend>
        <Text>
          Liste los miembros de equipo con la cantidad de horas semanales o
          meses totales a trabajar en su defecto
        </Text>
        <div className="mt-2 grid grid-cols-[repeat(21,minmax(0,1fr))] gap-1">
          <Field className="col-span-5">
            <Label>Autor</Label>
            <Description>Autor del material</Description>
          </Field>
          <Field className="col-span-12">
            <Label>Título</Label>
            <Description>Título de la publicación</Description>
          </Field>
          <Field className="col-span-3">
            <Label>Año</Label>
            <Description>Año de publicación</Description>
          </Field>
          <span />
          {form.values.sections.bibliography.chart.map((_, index) => (
            <Fragment key={index}>
              <FormInput
                className="col-span-5"
                label=""
                {...form.getInputProps(
                  'sections.bibliography.chart.${index}.author'
                )}
              />

              <FormInput
                className="col-span-12"
                label=""
                {...form.getInputProps(
                  `sections.bibliography.chart.${index}.title`
                )}
              />

              <FormInput
                className="col-span-3"
                label=""
                {...form.getInputProps(
                  `sections.bibliography.chart.${index}.year`
                )}
              />

              {index === 0 ?
                <span />
              : <Button plain className="mt-1 self-start">
                  <Trash
                    data-slot="icon"
                    onClick={() =>
                      form.removeListItem(`sections.bibliography.chart`, index)
                    }
                  />
                </Button>
              }
            </Fragment>
          ))}
        </div>

        <Button
          plain
          onClick={() => {
            form.insertListItem(`sections.bibliography.chart`, {
              author: '',
              title: '',
              year: 0,
            })

            setTimeout(() => {
              document
                .getElementById(
                  `row-${form.values.sections.identification.team.length}`
                )
                ?.getElementsByTagName('input')[0]
                .focus()
            }, 10)
          }}
          className="my-1"
        >
          <Plus data-slot="icon" />
          Añadir otra publicación
        </Button>
      </Fieldset>
    </motion.div>
  )
}
