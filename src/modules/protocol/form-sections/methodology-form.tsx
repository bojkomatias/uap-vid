'use client'

import { Fieldset, Legend, FieldGroup } from '@components/fieldset'
import { FormCheckbox } from '@shared/form/form-checkbox'
import { FormListbox } from '@shared/form/form-listbox'
import { FormTitapTextarea } from '@shared/form/form-tiptap-textarea'
import { motion } from 'framer-motion'
import { useProtocolContext } from 'utils/createContext'

export function MethodologyForm() {
  const form = useProtocolContext()

  return (
    <motion.div
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
    >
      <Fieldset>
        <Legend>Metodología</Legend>
        <FieldGroup>
          <FormListbox
            label="Tipo de investigación"
            description="El tipo de investigación a nivel metodológico"
            options={types.map((e) => ({ value: e, label: e }))}
            {...form.getInputProps('sections.methodology.type')}
          />

          {/* Conditionally render according to type */}
          {form.values.sections.methodology.type ===
            'Investigaciones cuantitativas, cualitativas, mixtas o experimentales' && (
            <QuantitativeQualitativeMixedOrExperimental />
          )}

          {form.values.sections.methodology.type ===
            'Investigaciones de tipo teóricas' && <Theoretical />}
        </FieldGroup>
      </Fieldset>
    </motion.div>
  )
}

const types = [
  'Investigaciones cuantitativas, cualitativas, mixtas o experimentales',
  'Investigaciones de tipo teóricas',
]

const QuantitativeQualitativeMixedOrExperimental = () => {
  const form = useProtocolContext()
  return (
    <>
      <FormTitapTextarea
        label="Diseño"
        description="Describa el diseño y el tipo de investigación"
        {...form.getInputProps('sections.methodology.design')}
      />
      <FormTitapTextarea
        label="Participantes"
        description="Participantes en la metodología del proyecto"
        {...form.getInputProps('sections.methodology.participants')}
      />
      <FormTitapTextarea
        label="Lugar"
        description="El lugar donde se llevará a cabo el desarrollo de la investigación"
        {...form.getInputProps('sections.methodology.place')}
      />
      <FormTitapTextarea
        label="Análisis de datos"
        description="Describa brevemente el proceso de análisis de los datos"
        {...form.getInputProps('sections.methodology.analysis')}
      />
      {/* <ConditionalIfRecollection path={path} /> */}
      <FormCheckbox
        label="Procedimientos especiales"
        description="Proyecto con procedimientos en humanos, animales o en base de datos"
        {...form.getInputProps('sections.methodology.humanAnimalOrDb', {
          type: 'checkbox',
        })}
      />

      {form.values.sections.methodology.humanAnimalOrDb && (
        <>
          <FormTitapTextarea
            label="Procedimientos de recolección"
            description="Qué procedimientos se utilizarán para la recolección de datos"
            {...form.getInputProps('sections.methodology.procedures')}
          />
          <FormTitapTextarea
            label="Instrumentos de recolección"
            description="Los instrumentos que se utilizarán para la recolección de datos"
            {...form.getInputProps('sections.methodology.instruments')}
          />
          <FormTitapTextarea
            label="Consideraciones éticas"
            description="Describa brevemente las consideraciones éticas a tener en cuenta"
            {...form.getInputProps('sections.methodology.considerations')}
          />
        </>
      )}
    </>
  )
}

const Theoretical = () => {
  const form = useProtocolContext()
  return (
    <FormTitapTextarea
      label="Detalle de metodología"
      {...form.getInputProps('sections.methodology.detail')}
    />
  )
}
