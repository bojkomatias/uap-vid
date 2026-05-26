'use client'
import { motion } from 'framer-motion'
import { useProtocolContext } from '@utils/createContext'
import { FieldGroup, Fieldset, Legend } from '@components/fieldset'
import { FormTitapTextarea } from '@shared/form/form-tiptap-textarea'

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
        <FieldGroup>
          <FormTitapTextarea
            label="Fuentes de información"
            description="Cargá las referencias bibliográficas del proyecto."
            {...form.getInputProps('sections.bibliography.content')}
          />
        </FieldGroup>
      </Fieldset>
    </motion.div>
  )
}
