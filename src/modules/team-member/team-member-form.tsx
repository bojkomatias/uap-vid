'use client'
import { Badge } from '@elements/badge'
import { Button } from '@elements/button'
import { Combobox, Listbox } from '@headlessui/react'
import { useForm, zodResolver } from '@mantine/form'
import type {
  HistoricTeamMemberCategory,
  TeamMember,
  User,
} from '@prisma/client'
import { cx } from '@utils/cx'
import RolesDictionary from '@utils/dictionaries/RolesDictionary'
import { TeamMemberSchema } from '@utils/zod'
import { useCallback, useState } from 'react'
import { Check, Selector, X } from 'tabler-icons-react'
import type { z } from 'zod'

import { notifications } from '@elements/notifications'
import { useRouter } from 'next/navigation'
import { createTeamMember, updateTeamMember } from '@repositories/team-member'

export default function TeamMemberForm({
  member,
  researchers,
  academicUnits,
}: {
  member:
    | (TeamMember & {
        categories: HistoricTeamMemberCategory[]
      } & { user: User | null })
    | null
  researchers: User[]
  academicUnits: {
    id: string
    name: string
    shortname: string
  }[]
}) {
  const router = useRouter()
  const form = useForm({
    initialValues: {
      id: member ? member.id : '',
      userId: member ? member.userId : null,
      name: member ? member.name : '',
      academicUnitId: member ? member.academicUnitId : null,
    },
    validate: zodResolver(TeamMemberSchema),
  })

  const saveTeamMember = useCallback(
    async (teamMember: z.infer<typeof TeamMemberSchema>) => {
      if (teamMember.id) {
        const updated = await updateTeamMember(teamMember.id, teamMember)
        if (updated) {
          notifications.show({
            title: 'Miembro actualizado',
            message:
              'El miembro de investigación fue actualizado correctamente',
            intent: 'success',
          })
          return router.refresh()
        }
        return notifications.show({
          title: 'Ocurrió un error',
          message: 'Error al actualizar el miembro de investigación',
          intent: 'error',
        })
      }

      // If new teamMember flow
      const created = await createTeamMember(teamMember)

      if (created) {
        notifications.show({
          title: 'Miembro creado',
          message: 'El miembro de investigación fue creado correctamente',
          intent: 'success',
        })

        return router.push(`/team-members/${created.id}`)
      }
      return notifications.show({
        title: 'Ha ocurrido un error',
        message: 'Hubo un error al crear el miembro de investigación',
        intent: 'error',
      })
    },
    [router]
  )

  const [query, setQuery] = useState('')

  const filteredPeople =
    query === '' ? researchers : (
      researchers.filter((user) => {
        return user.name.toLowerCase().includes(query.toLowerCase())
      })
    )

  return (
    <div>
      <form
        onSubmit={form.onSubmit((values) => saveTeamMember(values))}
        className="mt-10 max-w-5xl space-y-6"
      >
        <div>
          <div className="mb-2 text-sm font-medium">
            Relacione un usuario con el miembro de investigación
          </div>
          <label htmlFor="select-user" className="label">
            Usuario
          </label>
          <Combobox
            as="div"
            value={form.getInputProps('userId').value}
            onChange={(e: string) => {
              if (e !== null) {
                form.setFieldValue('userId', e)
                form.setFieldValue(
                  'name',
                  researchers.find((x) => x.id === e)!.name
                )
              }
            }}
            disabled={!!form.values.name && !form.values.userId}
            className="relative z-10"
          >
            <Combobox.Button className="relative w-full">
              <Combobox.Input
                autoComplete="off"
                className="input disabled:bg-gray-100"
                placeholder={`Seleccione un usuario`}
                onChange={(e) => setQuery(e.target.value)}
                displayValue={() =>
                  researchers.find(
                    (user) => user.id === form.getInputProps('userId').value
                  )?.name ?? ''
                }
              />

              <div className="absolute inset-y-0 right-0 flex items-center rounded-r-md pr-2 focus:outline-none">
                <X
                  className={cx(
                    'h-6 w-6 rounded-full p-1 text-gray-400 transition-all duration-200 hover:scale-110 hover:bg-gray-100 hover:stroke-2 hover:text-gray-700 active:scale-95',
                    form.getInputProps('userId').value === '' ? 'hidden' : ''
                  )}
                  onClick={(e) => {
                    form.setFieldValue('userId', null)
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
              <Combobox.Options className="absolute z-10 mt-1.5 max-h-60 w-full overflow-auto rounded border bg-white py-1 text-sm shadow focus:outline-none">
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
                          <Badge className="ml-4">
                            {RolesDictionary[value.role]}
                          </Badge>
                          <span
                            title={value.email}
                            className={cx(
                              'ml-3 truncate text-xs font-light',
                              active ? 'text-gray-700' : 'text-gray-500'
                            )}
                          >
                            {value.email}
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
        <div className="relative">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-sm font-light text-gray-600">
              O alternativamente
            </span>
          </div>
        </div>
        <div>
          <div className="mb-2 text-sm font-medium">
            Cree un nuevo miembro de investigación sin relación con un usuario
            existente.
          </div>
          <label htmlFor="name" className="label">
            Nombre completo
          </label>
          <input
            type="text"
            className="input disabled:bg-gray-100 disabled:text-gray-500"
            placeholder="Nombre completo"
            name="name"
            disabled={!!form.values.userId}
            {...form.getInputProps('name')}
          />
          {form.getInputProps('name').error ?
            <p className="error">*{form.getInputProps('name').error}</p>
          : null}
        </div>
        <div className="flex-grow">
          <label htmlFor="academicUnit" className="label">
            Unidad académica (Auspicia al docente)
          </label>
          <Listbox
            value={form.getInputProps('academicUnitId').value}
            onChange={(e) => {
              form.setFieldValue('academicUnitId', e)
            }}
          >
            <div className="relative mt-1 w-full">
              <Listbox.Button className="input text-left">
                <span className={'block truncate'}>
                  {form.values.academicUnitId ?
                    academicUnits.find(
                      (e) => e.id === form.values.academicUnitId
                    )?.name
                  : '-'}
                </span>
                <span className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-2">
                  <Selector className="h-4 text-gray-600 " aria-hidden="true" />
                </span>
              </Listbox.Button>

              <Listbox.Options className="absolute z-10 mt-1.5 max-h-60 w-full overflow-auto rounded border bg-white py-1 text-sm shadow focus:outline-none">
                {academicUnits.map((value) => (
                  <Listbox.Option
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
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>

        <Button
          intent="secondary"
          type="submit"
          disabled={!form.isDirty()}
          className="float-right"
        >
          {member ?
            'Actualizar miembro de investigación'
          : 'Crear miembro de investigación'}
        </Button>
      </form>
    </div>
  )
}
