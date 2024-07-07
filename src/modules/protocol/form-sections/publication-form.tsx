'use client'

import { FieldGroup, Fieldset, Legend } from '@components/fieldset'
import { FormListbox } from '@shared/form/form-listbox'
import { FormTitapTextarea } from '@shared/form/form-tiptap-textarea'
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
        <Legend>Publicación científica</Legend>
        <FieldGroup>
          <FormListbox
            label="Producción científica"
            description="Qué se espera como producto final al cabo de realizar la investigación"
            options={results.map((e) => ({ value: e, label: e }))}
            {...form.getInputProps('sections.publication.result')}
          />
          <FormTitapTextarea
            label="Título"
            description="Titulación propuesta para el libro o revista a publicar"
            {...form.getInputProps('sections.publication.title')}
          />
        </FieldGroup>
      </Fieldset>
    </motion.div>
  )
}

const results = ['Artículo científico', 'Capítulo de libro', 'Libro']
