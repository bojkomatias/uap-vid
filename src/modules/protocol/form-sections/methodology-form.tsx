'use client'
import SectionTitle from '@protocol/elements/form-section-title'
import Select from '@protocol/elements/inputs/protocol-combobox'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useProtocolContext } from 'utils/createContext'
const Textarea = dynamic(() => import('@protocol/elements/inputs/textarea'))

export function MethodologyForm() {
  const form = useProtocolContext()
  const path = 'sections.methodology.'

  return (
    <motion.div
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
      className="space-y-3"
    >
      <SectionTitle title="Metodología" />
      <span />
      <>
        <Select
          path={path + 'type'}
          options={types}
          label="tipo de investigación"
        />
        {conditionalByType(form.values.sections.methodology.type!, path)}
      </>
    </motion.div>
  )
}

const types = [
  'Investigaciones cuantitativas, cualitativas, mixtas o experimentales',
  'Investigaciones de tipo teóricas',
]
const conditionalByType = (v: string, path: string) => {
  if (
    v === 'Investigaciones cuantitativas, cualitativas, mixtas o experimentales'
  )
    return (
      <>
        <Textarea
          path={path + 'design'}
          label="Diseño y tipo de investigación"
        />
        <Textarea path={path + 'participants'} label="Participantes" />
        <Textarea path={path + 'place'} label="Lugar de desarrollo" />
        <Textarea path={path + 'analysis'} label="Análisis de datos" />
        <ConditionalIfRecollection path={path} />
      </>
    )
  if (v === 'Investigaciones de tipo teóricas')
    return (
      <>
        <Textarea path={path + 'detail'} label="Detalle de metodología" />
      </>
    )
}

const ConditionalIfRecollection = ({ path }: { path: string }) => {
  const form = useProtocolContext()

  return (
    <>
      <div className="ml-2 mt-6 flex h-6 items-center">
        <input
          id="recollection"
          name="recollection"
          type="checkbox"
          className="h-4 w-4 rounded-md  text-primary focus:ring-primary"
          {...form.getInputProps(path + 'humanAnimalOrDb', {
            type: 'checkbox',
          })}
        />
        <div className="ml-3 mt-0.5 text-sm leading-6">
          <label htmlFor="recollection" className="label pointer-events-auto">
            Proyecto con procedimientos en humanos, animales o en base de datos.
          </label>
        </div>
      </div>
      {form.getInputProps(path + 'humanAnimalOrDb').value ?
        <>
          <Textarea
            path={path + 'procedures'}
            label="Procedimientos para recolección de datos"
          />
          <Textarea
            path={path + 'instruments'}
            label="Instrumentos para recolección de datos"
          />
          <Textarea
            path={path + 'considerations'}
            label="Consideraciones éticas"
          />
        </>
      : null}
    </>
  )
}
