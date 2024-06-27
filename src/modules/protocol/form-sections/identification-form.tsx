'use client'

import { useProtocolContext } from 'utils/createContext'
import full from 'config/careers.json'
import { motion } from 'framer-motion'
import Select from '@protocol/elements/inputs/protocol-combobox'
import InfoTooltip from '@protocol/elements/tooltip'
import MultipleSelect from '@protocol/elements/inputs/protocol-multiple-combobox'
import SectionTitle from '@protocol/elements/form-section-title'
import TeamMemberListForm from '@protocol/elements/inputs/team-member-list-form'
import { FormInput } from '@shared/form/form-input'
import { FormListbox } from '@shared/form/form-listbox'
import { FormCombobox } from '@shared/form/form-combobox'

export function IdentificationForm() {
  const form = useProtocolContext()
  const path = 'sections.identification.'

  return (
    <motion.div
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
      className="space-y-3"
    >
      <SectionTitle title="Identificación" />
      <>
        <FormInput
          {...form.getInputProps(path + 'title')}
          label="Título"
          description="Un título descriptivo de su proyecto"
        />
        <FormCombobox
          label={'Carrera'}
          {...form.getInputProps(path + 'career')}
          options={[
            { value: '1', label: 'Option A' },
            { value: '2', label: 'option b' },
          ]}
        />
        <Select
          path={path + 'career'}
          options={careers}
          label="carrera"
          conditionalCleanup={() =>
            (form.values.sections.identification.assignment = '')
          }
        />
        <AssignmentInfo />
        <Select
          path={path + 'assignment'}
          label="materia (solo en caso de PIC)"
          options={assignments(form.values.sections.identification.career)}
        />
        <TeamInfo />
        <TeamMemberListForm />
        <FormListbox
          {...form.getInputProps(path + 'sponsor')}
          label="Ente patrocinante"
          options={[
            { value: '1', label: 'Option 1' },
            { value: '2', label: 'Option 2' },
            { value: '3', label: 'Option 3' },
          ]}
          multiple
        />
      </>
    </motion.div>
  )
}

const TeamInfo = () => (
  <InfoTooltip>
    <p>
      <b>Las horas corresponden a horas semanales.</b>
      <br />
      Si no encuentra un miembro de equipo, escriba nombre completo del mismo y
      guarde igualmente el formulario.
    </p>
    <p>
      <b>Codirector:</b> En el caso de un proyecto tesis de posgrado, agregar el
      nombre del director o consejero.
    </p>
    <p>
      {' '}
      <b>Investigadores externos UAP:</b> Colaboradores adhonorem{' '}
    </p>
    <p>
      {' '}
      <b>Técnico y Profesionales:</b> Después de que el proyecto sea aprobado y
      asignados los técnicos y los profesionales becados, deberá adjuntar un
      archivo para justificar la participación y detallar exhaustivamente las
      actividades que llevará a cabo cada uno, junto con: Conocimientos previos
      requeridos. Datos personales: apellido y nombre, tipo y número de
      documento, dirección de correo electrónico y dirección postal. Estudios:
      cantidad de asignaturas regularizadas y aprobadas de la carrera en curso o
      título de las carreras de grado o posgrado terminadas. Cursos realizados.
      Becas obtenidas anteriormente. Idiomas: con qué idiomas puede trabajar y
      con qué nivel en cada caso. Carta escrita por el postulante en la que
      fundamente la solicitud de la beca.
    </p>
  </InfoTooltip>
)

const AssignmentInfo = () => (
  <InfoTooltip>
    <p>
      <b>Materia:</b> La materia debe estar relacionada al a investigación.
      Utilizar solo en proyectos PIC. De lo contrario, dejar en blanco.
    </p>
  </InfoTooltip>
)

const careers = full.map((x) => x.career)
// conditional
const assignments = (v: string) =>
  full
    .filter((x) => x.career === v)
    .map((x) => x.assignment)
    .flat()

const sponsors = [
  'Facultad de Ciencias Económicas y de la Administración - FACEA',
  'Facultad de Ciencias de la Salud - FCS',
  'Facultad de Humanidades, Educación y Ciencias Sociales - FHECIS',
  'Facultad de Teología - FT',
  'Consejo Nacional de Investigaciones Científicas y Técnicas - CONICET',
  'Centro Interdisciplinario de Investigaciones en Ciencias de la Salud y del Comportamiento - CIICSAC',
  'Escuela de Graduados - EG',
]
