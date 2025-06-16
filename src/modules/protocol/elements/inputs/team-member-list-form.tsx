'use client'
import { useProtocolContext } from '@utils/createContext'
import React, { Fragment } from 'react'
import { Plus, Trash } from 'tabler-icons-react'
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
import Info from '@shared/info'

import { useQuery } from '@tanstack/react-query'
import { getCategoriesForForm } from '@repositories/team-member-category'
import { FormSwitch } from '@shared/form/form-switch'

export default function TeamMemberListForm() {
  const form = useProtocolContext()

  const { data: teamMembers } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: async () => await getAllTeamMembers(),
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => await getCategoriesForForm(),
  })

  const roles_categories = [
    'Técnico Asistente',
    'Técnico Asociado',
    'Técnico Principal',
    'Profesional Adjunto',
    'Profesional Principal',
  ]

  const roles_categories_ids = roles_categories.map((r_c) => {
    const category = categories?.find((c) => c.name == r_c)
    return { value: category?.id, label: category?.name }
  }) as { value: string; label: string }[]

  return (
    <Fieldset>
      <Legend>Miembros de Equipo</Legend>
      <Text>
        Liste los miembros de equipo con la cantidad de horas semanales o meses
        totales a trabajar en su defecto
      </Text>
      <div className="mt-2 grid grid-cols-[repeat(21,minmax(0,1fr))] gap-1">
        <Field className="col-span-4">
          <Info content="Puede especificar que va a haber una persona con un rol específico trabajando en el proyecto de investigación. Si el presupuesto es aprobado, debe confirmar el nombre de esta persona antes de comenzar con el proyecto de investigación.">
            <Label>A definir</Label>
            <Description>Miembro de equipo a definir</Description>
          </Info>
        </Field>
        <Field className="col-span-4">
          <Label>Rol</Label>
          <Description>Rol del miembro</Description>
        </Field>
        <Field className="col-span-8">
          <Label>Miembro</Label>
          <Description>
            Seleccione miembro de equipo si existe o escriba su nombre abajo del
            selector
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
              <FormSwitch
                checked={
                  form.getInputProps(
                    `sections.identification.team.${index}.toBeConfirmed`
                  ).value
                }
                disabled={index == 0}
                title={
                  index == 0 ?
                    "El primer miembro de equipo no puede quedar 'a definir'"
                  : undefined
                }
                label=""
                {...form.getInputProps(
                  `sections.identification.team.${index}.toBeConfirmed`
                )}
                className="col-span-4"
              />

              {(
                form.getInputProps(
                  `sections.identification.team.${index}.toBeConfirmed`
                ).value
              ) ?
                <FormListbox
                  className="col-span-4"
                  label=""
                  placeholder={
                    form.getInputProps(
                      `sections.identification.team.${index}.toBeConfirmed`
                    ).value && 'Seleccione una categoría'
                  }
                  options={roles_categories_ids}
                  {...form.getInputProps(
                    `sections.identification.team.${index}.categoryToBeConfirmed`
                  )}
                />
              : <FormListbox
                  className="col-span-4"
                  label=""
                  options={roleOptions.map((e) => ({ value: e, label: e }))}
                  {...form.getInputProps(
                    `sections.identification.team.${index}.role`
                  )}
                />
              }
              <div className="col-span-8 flex flex-col">
                <FormCombobox
                  label=""
                  placeholder="Si el miembro de equipo no existe, escriba el nombre abajo"
                  options={
                    teamMembers?.map((e) => ({
                      value: e.id,
                      label: e.name,
                    })) ?? []
                  }
                  disabled={
                    form.getInputProps(
                      `sections.identification.team.${index}.toBeConfirmed`
                    ).value
                  }
                  {...form.getInputProps(
                    `sections.identification.team.${index}.teamMemberId`
                  )}
                />

                <FormInput
                  className="float-left"
                  placeholder="Nombre del miembro de equipo"
                  label=""
                  style={{ fontSize: '11px', padding: '1px 10px' }}
                  type="text"
                  disabled={
                    form.getInputProps(
                      `sections.identification.team.${index}.toBeConfirmed`
                    ).value
                  }
                  {...form.getInputProps(
                    `sections.identification.team.${index}.name`
                  )}
                />
              </div>

              <FormInput
                className="col-span-2"
                label=""
                type="number"
                {...form.getInputProps(
                  `sections.identification.team.${index}.hours`
                )}
              />
              <FormInput
                className="col-span-2"
                label=""
                type="number"
                {...form.getInputProps(
                  `sections.identification.team.${index}.workingMonths`
                )}
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
            role: 'Investigador UAP',
            teamMemberId: null,
            workingMonths: 12,
            toBeConfirmed: false,
            categoryToBeConfirmed: categories?.find(
              (c) => c.name == 'Técnico Asistente'
            )?.id,
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
