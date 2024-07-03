'use client'
import { useProtocolContext } from '@utils/createContext'
import React, { Fragment, useEffect, useState } from 'react'
import { Check, Plus, Selector, Trash, X } from 'tabler-icons-react'
import { cx } from '@utils/cx'
import { Combobox } from '@headlessui/react'
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
  const path = 'sections.identification.team'

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
        {form.values.sections.identification.team.map((_, index) => (
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
                  onClick={() => form.removeListItem(path, index)}
                />
              </Button>
            }
          </Fragment>
        ))}
      </div>

      <Button
        plain
        onClick={() => {
          form.insertListItem(path, {
            hours: 0,
            last_name: '',
            name: '',
            role: '',
            teamMemberId: null,
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

function TeamMemberSelector({
  teamMembers,
  index,
}: {
  teamMembers: TeamMember[]
  index: number
}) {
  const form = useProtocolContext()
  const path = 'sections.identification.team'

  const [query, setQuery] = useState('')

  const filteredPeople =
    query === '' ? teamMembers : (
      teamMembers.filter((member) => {
        return member.name.toLowerCase().includes(query.toLowerCase())
      })
    )

  return (
    <div className="col-span-5">
      <label htmlFor="select-user" className="label">
        Miembro del equipo
      </label>
      <Combobox
        as="div"
        value={form.getInputProps(`${path}.${index}.teamMemberId`).value}
        onChange={(e: string) => {
          form.setFieldValue(`${path}.${index}.teamMemberId`, e)
          form.setFieldValue(`${path}.${index}.name`, '')
          form.setFieldValue(`${path}.${index}.last_name`, '')
        }}
        className="relative"
      >
        <Combobox.Button className="relative w-full">
          <Combobox.Input
            autoComplete="off"
            className="input disabled:bg-gray-100"
            placeholder={`Seleccione un docente`}
            onChange={(e) => {
              setQuery(e.target.value)
              form.setFieldValue(`${path}.${index}.name`, e.target.value)
              form.setFieldValue(`${path}.${index}.last_name`, '')
            }}
            displayValue={() =>
              teamMembers.find(
                (e) =>
                  e.id ===
                  form.getInputProps(`${path}.${index}.teamMemberId`).value
              )?.name ??
              (form.getInputProps(`${path}.${index}.name`).value +
                ' ' +
                form.getInputProps(`${path}.${index}.last_name`).value ||
                '')
            }
          />

          <div className="absolute inset-y-0 right-0 flex items-center rounded-r-md pr-2 focus:outline-none">
            <X
              className={cx(
                'h-6 w-6 rounded-full p-1 text-gray-400 transition-all duration-200 hover:scale-110 hover:bg-gray-100 hover:stroke-2 hover:text-gray-700 active:scale-95'
              )}
              onClick={(e) => {
                form.setFieldValue(`${path}.${index}.teamMemberId`, null)
                form.setFieldValue(`${path}.${index}.name`, '')
                form.setFieldValue(`${path}.${index}.last_name`, '')
                e.stopPropagation()
              }}
              aria-hidden="true"
            />
            <Selector
              className="h-4 text-gray-600 hover:text-gray-400"
              aria-hidden="true"
            />
          </div>
        </Combobox.Button>

        {filteredPeople.length > 0 ?
          <Combobox.Options className="absolute z-20 mt-1.5 max-h-60 w-full overflow-auto rounded border bg-white py-1 text-sm shadow focus:outline-none">
            {filteredPeople.map((value) => (
              <Combobox.Option
                key={value.id}
                value={value.id}
                className={({ active }) =>
                  cx(
                    'relative cursor-default select-none py-2 pl-8 pr-2',
                    active ? 'bg-gray-100' : 'text-gray-600'
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span className="block truncate font-medium">
                      <span
                        className={cx(
                          active && 'text-gray-800',
                          selected && 'text-primary'
                        )}
                      >
                        {value.name}
                      </span>
                    </span>

                    {selected && (
                      <span
                        className={cx(
                          'absolute inset-y-0 left-0 flex items-center pl-2 text-primary',
                          active ? 'text-white' : ''
                        )}
                      >
                        <Check
                          className="h-4 w-4 text-gray-500"
                          aria-hidden="true"
                        />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        : null}
      </Combobox>
    </div>
  )
}
