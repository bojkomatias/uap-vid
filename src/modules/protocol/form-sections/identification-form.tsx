'use client'

import { useProtocolContext } from 'utils/createContext'
import { motion } from 'framer-motion'
import InfoTooltip from '@protocol/elements/tooltip'
import TeamMemberListForm from '@protocol/elements/inputs/team-member-list-form'
import { FormInput } from '@shared/form/form-input'
import { FormListbox } from '@shared/form/form-listbox'
import { FormCombobox } from '@shared/form/form-combobox'
import { FieldGroup, Fieldset, Legend } from '@components/fieldset'
import type { Career, Course } from '@prisma/client'
import { useEffect, useState } from 'react'
import {
  getActiveCarrersForForm,
  getCoursesByCareerId,
} from '@repositories/career'
import { getAcademicUnitsForForm } from '@repositories/academic-unit'

export function IdentificationForm() {
  const form = useProtocolContext()
  const [careers, setCareers] = useState<
    Omit<Career, 'academicUnitId' | 'active'>[]
  >([])
  const [courses, setCourses] = useState<Omit<Course, 'careerId' | 'active'>[]>(
    []
  )
  const [academicUnits, setAcademicUnits] = useState<
    { id: string; name: string; shortname: string }[]
  >([])

  useEffect(() => {
    ;(async () => {
      setCareers(await getActiveCarrersForForm())
      setAcademicUnits(await getAcademicUnitsForForm())
    })()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
    >
      <Fieldset>
        <Legend>Identificación</Legend>
        <FieldGroup>
          <FormInput
            label="Título"
            description="Un título descriptivo de su proyecto"
            {...form.getInputProps('sections.identification.title')}
          />
          <FormCombobox
            label="Carrera"
            description="Seleccione la carrera que más se relacionada esté al proyecto de investigación"
            options={careers.map((e) => ({ value: e.id, label: e.name }))}
            {...form.getInputProps('sections.identification.careerId')}
            onChange={async (e: any) => {
              if (!e) return
              form.setFieldValue('sections.identification.careerId', e)
              const result = await getCoursesByCareerId(e)
              setCourses(result ? result.courses : [])
              form.setFieldValue('sections.identification.courseId', '')
            }}
          />
          <AssignmentInfo />
          <FormCombobox
            label="Materia"
            description="Seleccione una materia si aplica (requerido en caso de PIC)"
            disabled={
              !form.getInputProps('sections.identification.careerId').value ||
              courses.length === 0
            }
            options={courses.map((e) => ({ value: e.id, label: e.name }))}
            {...form.getInputProps('sections.identification.courseId')}
          />
          <TeamInfo />
          <TeamMemberListForm />
          <FormListbox
            multiple
            label="Ente patrocinante"
            description="Seleccione una o más unidades académicas o entes patrocinantes que auspician el proyecto"
            options={academicUnits.map((e) => ({
              value: e.id,
              label: e.shortname,
              description: e.name,
            }))}
            {...form.getInputProps('sections.identification.academicUnitIds')}
          />
        </FieldGroup>
      </Fieldset>
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
