'use client'
<<<<<<< HEAD
import { Badge } from '@components/badge'
import { Button } from '@elements/button'
import { Combobox, Listbox } from '@headlessui/react'
=======

>>>>>>> develop
import { useForm, zodResolver } from '@mantine/form'
import type {
  HistoricTeamMemberCategory,
  TeamMember,
  User,
} from '@prisma/client'
import { TeamMemberSchema } from '@utils/zod'
import { useCallback, useTransition } from 'react'
import type { z } from 'zod'
import { notifications } from '@elements/notifications'
import { useRouter } from 'next/navigation'
import { createTeamMember, updateTeamMember } from '@repositories/team-member'
import { FieldGroup, Fieldset, FormActions, Legend } from '@components/fieldset'
import { FormCombobox } from '@shared/form/form-combobox'
import { FormListbox } from '@shared/form/form-listbox'
import { FormInput } from '@shared/form/form-input'
import { FormButton } from '@shared/form/form-button'
import { Divider } from '@components/divider'
import { Text } from '@components/text'

export default function TeamMemberForm({
  member,
  researchers,
  academicUnits,
  onSubmitCallback,
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
  onSubmitCallback?: () => void
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

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
      const { id, ...data } = teamMember

      if (member) {
        const updated = await updateTeamMember(id, data)
        if (updated) {
          notifications.show({
            title: 'Miembro actualizado',
            message:
              'El miembro de investigación fue actualizado correctamente',
            intent: 'success',
          })
          return startTransition(() => {
            router.refresh()
            if (onSubmitCallback) onSubmitCallback()
          })
        }
        return notifications.show({
          title: 'Ocurrió un error',
          message: 'Error al actualizar el miembro de investigación',
          intent: 'error',
        })
      }

      // Only pass the data
      const created = await createTeamMember(data)

      if (created) {
        notifications.show({
          title: 'Miembro creado',
          message: 'El miembro de investigación fue creado correctamente',
          intent: 'success',
        })

        return startTransition(() => {
          router.refresh()
          if (onSubmitCallback) onSubmitCallback()
        })
      }
      return notifications.show({
        title: 'Ha ocurrido un error',
        message: 'Hubo un error al crear el miembro de investigación',
        intent: 'error',
      })
    },
    [router, member, onSubmitCallback]
  )

  return (
    <form onSubmit={form.onSubmit((values) => saveTeamMember(values))}>
      <Fieldset>
        <FieldGroup>
          <Legend>
            Relacione un usuario o cree un nuevo miembro de investigación.
          </Legend>
          <Text className="text-xs sm:text-xs">
            Notesé que es mutuamente excluyente, no puede relacionar un usuario
            y escribir un nombre para dar de alta. Si el nuevo investigador no
            es aún usuario del sistema, deje el primer campo en blanco.
          </Text>
          <FormCombobox
            label="Usuario"
            description="Seleccione un usuario que sera relacionado directamente con el miembro de investigacion"
            disabled={!!form.values.name && !form.values.userId}
            options={researchers.map((e) => ({ value: e.id, label: e.name }))}
            {...form.getInputProps('userId')}
            onBlur={() => {
              if (form.getInputProps('userId').value)
                form.setFieldValue(
                  'name',
                  researchers.find(
                    (x) => x.id === form.getInputProps('userId').value
                  )!.name
                )
            }}
          />

<<<<<<< HEAD
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
                          <Badge>{RolesDictionary[value.role]}</Badge>
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
=======
          <FormInput
            label="Nombre completo"
            description="Nombre completo del investigador"
>>>>>>> develop
            disabled={!!form.values.userId}
            {...form.getInputProps('name')}
          />
        </FieldGroup>
        <Divider className="mt-6" />
        <FieldGroup>
          <FormListbox
            label="Unidad academica"
            description="Unidad academica que auspicia al docente investigador"
            options={academicUnits.map((e) => ({ value: e.id, label: e.name }))}
            {...form.getInputProps('academicUnitId')}
          />
        </FieldGroup>
      </Fieldset>
      <FormActions>
        <FormButton isLoading={isPending}>
          {member ?
            'Actualizar miembro de investigación'
          : 'Crear miembro de investigación'}
        </FormButton>
      </FormActions>
    </form>
  )
}
