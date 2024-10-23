'use client'

import { FieldGroup, Fieldset, Legend } from '@components/fieldset'
import { FormTitapTextarea } from '@shared/form/form-tiptap-textarea'
import { useProtocolContext } from '@utils/createContext'
import { motion } from 'framer-motion'

export function IntroductionForm() {
  const form = useProtocolContext()

  return (
    <motion.div
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
    >
      <Fieldset>
        <Legend>Introducción al proyecto</Legend>
        <FieldGroup>
          <FormTitapTextarea
            label="Estado del arte"
            description="Describa el estado actual del tema y principales antecedentes en la literatura"
            {...form.getInputProps('sections.introduction.state')}
          />
          <FormTitapTextarea
            label="Justificación"
            description="Justifique científica, académica y socialmente el proyecto"
            {...form.getInputProps('sections.introduction.justification')}
          />
          <FormTitapTextarea
            label="Definición del problema"
            description="Describa y defina el problema a investigar"
            {...form.getInputProps('sections.introduction.problem')}
          />
          <FormTitapTextarea
            label="Objetivos"
            description="Enuncie los objetivos de dicha investigación"
            {...form.getInputProps('sections.introduction.objectives')}
          />
        </FieldGroup>
      </Fieldset>
    </motion.div>
  )
}
