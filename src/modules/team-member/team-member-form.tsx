'use client'

import { useForm, zodResolver } from '@mantine/form'
import type {
  HistoricTeamMemberCategory,
  TeamMember,
  User,
} from '@prisma/client'
import { TeamMemberSchema } from '@utils/zod'
import { useCallback } from 'react'
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

  return (
    <form onSubmit={form.onSubmit((values) => saveTeamMember(values))}>
      <Fieldset>
        <FieldGroup>
          <Legend>
            Relacione un usuario con el miembro de investigación o cree un nuevo
            miembro de investigación sin relación con un usuario existente.
          </Legend>
          <Text>
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
          />

          <FormInput
            label="Nombre completo"
            description="Nombre completo del investigador"
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
        <FormButton isLoading={!form.isDirty()}>
          {member ?
            'Actualizar miembro de investigación'
          : 'Crear miembro de investigación'}
        </FormButton>
      </FormActions>
    </form>
  )
}
