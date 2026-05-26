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
            label="Estado actual del tema y principales antecedentes en la literatura"
            {...form.getInputProps('sections.introduction.state')}
          />
          <FormTitapTextarea
            label="Justificación teórica, práctica, metodológica, social, económica y técnica"
            description="Desarrollar todos los tipos de justificación que se apliquen al tipo de investigación"
            {...form.getInputProps('sections.introduction.justification')}
          />
          <FormTitapTextarea
            label="Definición del problema"
            {...form.getInputProps('sections.introduction.problem')}
          />
          <FormTitapTextarea
            label="Objetivos"
            {...form.getInputProps('sections.introduction.objectives')}
          />
        </FieldGroup>
      </Fieldset>
    </motion.div>
  )
}
