'use client'

import { FieldGroup, Fieldset, FormActions, Legend } from '@components/fieldset'
import { notifications } from '@elements/notifications'
import { useForm, zodResolver } from '@mantine/form'
import type { Prisma, TeamMemberCategory } from '@prisma/client'
import { updateCategoryHistory } from '@repositories/team-member'
import { SubmitButton } from '@shared/submit-button'
import { FormInput } from '@shared/form/form-input'
import { FormListbox } from '@shared/form/form-listbox'
import { cx } from '@utils/cx'
import { useRouter } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import { z } from 'zod'

export type TeamMemberWithCategories = Prisma.TeamMemberGetPayload<{
  include: { categories: true; user: true }
}>

export default function CategorizationForm({
  categories,
  obreroCategory,
  member,
  onSubmitCallback,
}: {
  categories: TeamMemberCategory[]
  obreroCategory: TeamMemberCategory
  member: TeamMemberWithCategories
  onSubmitCallback?: () => void
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const currentCategory = member.categories.at(-1)

  const categorizationSchema = z
    .object({
      categoryId: z
        .string()
        .min(1, { message: 'Debe seleccionar una categoria' }),
      pointsObrero: z.coerce.number().nullish(),
    })
    .refine(
      (val) => !(!val.pointsObrero && val.categoryId === obreroCategory.id),
      {
        message: 'Debe completar los puntos del obrero',
        path: ['pointsObrero'],
      }
    )

  const form = useForm({
    initialValues: {
      categoryId: currentCategory?.categoryId ?? '',
      pointsObrero: currentCategory?.pointsObrero,
    },
    validate: zodResolver(categorizationSchema),
    transformValues: (values) => categorizationSchema.parse(values),
  })

  const categorizeTeamMember = useCallback(
    async ({
      categoryId,
      pointsObrero,
    }: z.infer<typeof categorizationSchema>) => {
      const data = {
        newCategory: categoryId,
        pointsObrero,
        expireId: currentCategory?.id,
        memberId: member.id,
      }

      const updated = await updateCategoryHistory(data)

      if (updated) {
        notifications.show({
          title: 'Categoría actualizada',
          message:
            'La categoría del miembro de investigación fue actualizada con éxito',
          intent: 'success',
        })
        return startTransition(() => {
          router.refresh()
          if (onSubmitCallback) onSubmitCallback()
        })
      }
      notifications.show({
        title: 'Ha ocurrido un error',
        message:
          'Hubo un error al actualizar la categoría del miembro de investigación.',
        intent: 'error',
      })
    },
    [currentCategory, member.id, router, onSubmitCallback]
  )

  return (
    <form onSubmit={form.onSubmit((values) => categorizeTeamMember(values))}>
      <Fieldset>
        <Legend>Categorizando a {member.name}</Legend>
        <FieldGroup>
          <FormListbox
            label="Categoría"
            description="Seleccione la categoría a la cual pertenece el investigador"
            options={categories.map((e) => ({ value: e.id, label: e.name }))}
            {...form.getInputProps('categoryId')}
            onBlur={() => {
              if (form.getInputProps('categoryId').value !== obreroCategory?.id)
                form.setFieldValue('pointsObrero', null)
            }}
          />
          <FormInput
            className={cx(
              form.getInputProps('categoryId').value !== obreroCategory?.id &&
                'hidden'
            )}
            label="Puntos"
            description="La cantidad puntos del docente investigador obrero"
            type="number"
            {...form.getInputProps('pointsObrero')}
          />
        </FieldGroup>
      </Fieldset>
      <FormActions>
        <SubmitButton isLoading={isPending}>Actualizar categoría</SubmitButton>
      </FormActions>
    </form>
  )
}
