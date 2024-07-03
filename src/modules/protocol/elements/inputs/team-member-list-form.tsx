'use client'
import { useProtocolContext } from '@utils/createContext'
import React, { Fragment, useEffect, useState } from 'react'
import { Plus, Trash } from 'tabler-icons-react'
import type { TeamMember } from '@prisma/client'
import { getAllTeamMembers } from '@repositories/team-member'
import {
  Description,
  Field,
  Fieldset,
  Label,
  Legend,
} from '@components/fieldset'
import { Button } from '@components/button'
import { FormListbox } from '@shared/form/form-listbox'
import { FormInput } from '@shared/form/form-input'
import { FormCombobox } from '@shared/form/form-combobox'
import { Text } from '@components/text'

export default function TeamMemberListForm() {
  const form = useProtocolContext()

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])

  useEffect(() => {
    ;(async () => {
      setTeamMembers(await getAllTeamMembers())
    })()
  }, [])

  return (
    <Fieldset>
      <Legend>Miembros de Equipo</Legend>
      <Text>
        Liste los miembros de equipo con la cantidad de horas semanales o meses
        totales a trabajar en su defecto
      </Text>
      <div className="mt-2 grid grid-cols-[repeat(21,minmax(0,1fr))] gap-1">
        <Field className="col-span-4">
          <Label>Rol</Label>
          <Description>Rol del miembro</Description>
        </Field>
        <Field className="col-span-12">
          <Label>Miembro</Label>
          <Description>
            Seleccione miembro de equipo si existe o uno genérico si no
          </Description>
        </Field>
        <Field className="col-span-2">
          <Label>Horas</Label>
          <Description>En una semana</Description>
        </Field>
        <Field className="col-span-2">
          <Label>Meses</Label>
          <Description>En un año</Description>
        </Field>
        <span />
        {form
          .getValues()
          .sections.identification.team.map((_: any, index: number) => (
            <Fragment key={index}>
              <FormListbox
                className="col-span-4"
                label=""
                options={roleOptions.map((e) => ({ value: e, label: e }))}
                {...form.getInputProps(
                  `sections.identification.team.${index}.role`
                )}
              />

              <FormCombobox
                className="col-span-12"
                label=""
                options={teamMembers.map((e) => ({
                  value: e.id,
                  label: e.name,
                }))}
                {...form.getInputProps(
                  `sections.identification.team.${index}.teamMemberId`
                )}
              />

              <FormInput
                className="col-span-2"
                label=""
                type="number"
                {...form.getInputProps(
                  `sections.identification.team.${index}.hours`
                )}
                onBlur={(e: any) => {
                  form.setFieldValue(
                    `sections.identification.team.${index}.hours`,
                    parseInt(
                      form.getInputProps(
                        `sections.identification.team.${index}.hours`
                      ).value
                    )
                  )
                }}
              />

              <FormInput
                className="col-span-2"
                label=""
                type="number"
                {...form.getInputProps(
                  `sections.identification.team.${index}.workingMonths`
                )}
                onBlur={(e: any) => {
                  form.setFieldValue(
                    `sections.identification.team.${index}.workingMonths`,
                    parseInt(
                      form.getInputProps(
                        `sections.identification.team.${index}.workingMonths`
                      ).value
                    )
                  )
                }}
              />

              {index === 0 ?
                <span />
              : <Button plain className="mt-1 self-start">
                  <Trash
                    data-slot="icon"
                    onClick={() =>
                      form.removeListItem('sections.identification.team', index)
                    }
                  />
                </Button>
              }
            </Fragment>
          ))}
      </div>

      <Button
        plain
        onClick={() => {
          form.insertListItem('sections.identification.team', {
            hours: 0,
            last_name: '',
            name: '',
            role: '',
            teamMemberId: null,
            workingMonths: 0,
          })

          setTimeout(() => {
            document
              .getElementById(
                `row-${form.values.sections.identification.team.length}`
              )
              ?.getElementsByTagName('input')[0]
              .focus()
          }, 10)
        }}
        className="my-1"
      >
        <Plus data-slot="icon" />
        Añadir otro miembro de equipo
      </Button>
    </Fieldset>
  )
}

const roleOptions = [
  'Director',
  'Codirector',
  'Investigador UAP',
  'Investigador Externo UAP',
  'Técnico Asistente',
  'Técnico Asociado',
  'Técnico Principal',
  'Profesional Adjunto',
  'Profesional Principal',
  'Becario CONICET',
  'A definir',
]
