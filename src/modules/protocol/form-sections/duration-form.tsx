'use client'

import { useProtocolContext } from 'utils/createContext'
import { motion } from 'framer-motion'
import InfoTooltip from '@protocol/elements/tooltip'
import { cache } from 'react'
import { ChronogramList } from '@protocol/elements/inputs/chronogram-list-form'
import { FieldGroup, Fieldset, Legend } from '@components/fieldset'
import { FormListbox } from '@shared/form/form-listbox'

export function DurationForm() {
  const form = useProtocolContext()
  const path = 'sections.duration.'

  return (
    <motion.div
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
    >
      <Fieldset>
        <Legend>Duración</Legend>
        <Info />
        <FieldGroup>
          <FormListbox
            label="Modalidad"
            description="La modalidad que corresponde al proyecto"
            options={modalities.map((e) => ({ value: e, label: e }))}
            {...form.getInputProps('sections.duration.modality')}
          />
          <FormListbox
            label="Duración"
            description="Seleccione la duración en meses que el proyecto va a tomar"
            options={duration(form.values.sections.duration.modality).map(
              (e) => ({ value: e, label: e })
            )}
            {...form.getInputProps('sections.duration.duration')}
            onChange={(e: any) => {
              if (!e) return null
              form.setFieldValue(
                path + 'chronogram',
                structureSemestersFromMonths(e)
              )
            }}
          />
          <ChronogramList />
        </FieldGroup>
      </Fieldset>
    </motion.div>
  )
}

const modalities = [
  'Proyecto regular de investigación (PRI)',
  'Proyecto de investigación con becados (PIB)',
  'Proyecto de investigación desde las cátedras (PIC)',
  'Proyecto de investigación institucional (PII)',
  'Proyecto de investigación interfacultades (PIIF)',
  'Proyecto I + D + i (PIDi)',
  'Proyecto Tesis Posgrado (PTP)',
]

/** Depending on if the project type is a "PIC", it can have a duration that's less than 12 months. Using this helper we manage to add this exception */
const duration = (value: string) => {
  if (value === 'Proyecto de investigación desde las cátedras (PIC)')
    return ['6 meses', '12 meses', '24 meses']
  else return ['12 meses', '24 meses', '36 meses', '48 meses', '60 meses']
}

const structureSemestersFromMonths = cache((e: string) => {
  const semesters = Number(e.substring(0, 2)) / 6

  const allSemesters = []
  for (let i = 1; i <= semesters; i++) {
    allSemesters.push({ semester: `${i}º semestre`, data: [{ task: '' }] })
  }
  return allSemesters
})

const Info = () => (
  <InfoTooltip>
    La duración de 60 meses solo será aplicable a proyectos vinculados con
    programas doctorales.
    <br />
    Agregue todas las tareas que correspondan por semestre.
  </InfoTooltip>
)
