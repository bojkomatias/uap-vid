'use client'
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
        <FormButton isLoading={isPending}>
          {member ?
            'Actualizar miembro de investigación'
          : 'Crear miembro de investigación'}
        </FormButton>
      </FormActions>
    </form>
  )
}
