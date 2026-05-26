'use client'

import { FieldGroup, Fieldset, Legend } from '@components/fieldset'
import { FormListbox } from '@shared/form/form-listbox'
import { useProtocolContext } from '@utils/createContext'
import { motion } from 'framer-motion'

export function PublicationForm() {
  const form = useProtocolContext()

  return (
    <motion.div
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
    >
      <Fieldset>
        <Legend>Producción</Legend>
        <FieldGroup>
          <FormListbox
            label="Producción científica"
            options={results.map((e) => ({ value: e, label: e }))}
            {...form.getInputProps('sections.publication.result')}
          />
          <FormListbox
            label="Producción tecnológica"
            options={technologicalResults.map((e) => ({ value: e, label: e }))}
            {...form.getInputProps('sections.publication.technologicalResult')}
          />
        </FieldGroup>
      </Fieldset>
    </motion.div>
  )
}

const results = ['Artículo científico', 'Capítulo de libro', 'Libro']

const technologicalResults = ['Patente', 'Software', 'Prototipo', 'Informe técnico']
