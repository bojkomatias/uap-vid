'use client'

import {
  Dialog,
  DialogActions,
  DialogDescription,
  DialogTitle,
} from '@components/dialog'
import { SubmitButton } from '@shared/submit-button'
import { TeamMemberCategorySchema } from '@utils/zod'
import { updateCategory } from '@repositories/team-member-category'
import { notifications } from '@elements/notifications'
import { FieldGroup, Fieldset } from '@components/fieldset'
import { useForm, zodResolver } from '@mantine/form'
import { FormInput } from '@shared/form/form-input'
import { useRouter } from 'next/navigation'
import type { z } from 'zod'
import { useState, useTransition } from 'react'
import { FormCheckbox } from '@shared/form/form-checkbox'
import { TeamMemberCategory } from '@prisma/client'
import { BadgeButton } from '@components/badge'

export function EditCategoryDialog({
  teamMemberCategory,
  currentFCA,
}: {
  teamMemberCategory: TeamMemberCategory
  currentFCA: number
}) {
  const [open, setOpen] = useState(false)

  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm({
    initialValues: {
      specialCategory: teamMemberCategory.specialCategory,
      state: true,
      name: teamMemberCategory.name,
      amount: teamMemberCategory.amountIndex.FCA * currentFCA,
    },
    validate: zodResolver(TeamMemberCategorySchema),
    validateInputOnBlur: true,
  })

  const submitCategory = async (
    category: z.infer<typeof TeamMemberCategorySchema>
  ) => {
    const updated = await updateCategory(teamMemberCategory.id, category)

    if (updated) {
      notifications.show({
        title: 'Categoría actualizada',
        message: 'Se actualizó correctamente la categoría',
        intent: 'success',
      })
      return startTransition(() => router.refresh())
    }

    notifications.show({
      title: 'Error',
      message: 'No se pudo actualizar la categoría',
      intent: 'error',
    })
    return startTransition(() => router.refresh())
  }

  return (
    <>
      <BadgeButton onClick={() => setOpen(true)}>Editar</BadgeButton>

      <Dialog open={open} onClose={setOpen} size="2xl">
        <DialogTitle>Editar categoria</DialogTitle>
        <DialogDescription>
          Aquí puede editar una nueva categoria para luego asignarla a los
          investigadores
        </DialogDescription>
        <form onSubmit={form.onSubmit((values) => submitCategory(values))}>
          <Fieldset>
            <FieldGroup>
              <FormInput
                label="Nombre"
                description="Nombre de la categoria"
                {...form.getInputProps('name')}
              />
              <FormInput
                label="Valor hora"
                description="El valor de las hora actual, este valor luego es indexado"
                type="number"
                {...form.getInputProps('amount')}
              />
              <FormCheckbox
                label="No indexada"
                description="Si la categoría no se indexa, no se actualiza su valor con los indices. El valor de la hora se mantiene fijo en pesos."
                {...form.getInputProps('specialCategory')}
              />
            </FieldGroup>
          </Fieldset>

          <DialogActions>
            <SubmitButton isLoading={isPending}>Editar categoria</SubmitButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
