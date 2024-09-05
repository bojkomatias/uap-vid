'use client'

import {
  Dialog,
  DialogActions,
  DialogDescription,
  DialogTitle,
} from '@components/dialog'
import { ScriptPlus } from 'tabler-icons-react'
import { Button } from '@components/button'
import { SubmitButton } from '@shared/submit-button'
import { TeamMemberCategorySchema } from '@utils/zod'
import { insertCategory } from '@repositories/team-member-category'
import { notifications } from '@elements/notifications'
import { FieldGroup, Fieldset } from '@components/fieldset'
import { useForm, zodResolver } from '@mantine/form'
import { FormInput } from '@shared/form/form-input'
import { useRouter } from 'next/navigation'
import type { z } from 'zod'
import { useState, useTransition } from 'react'

export function NewCategoryDialog() {
  const [open, setOpen] = useState(false)

  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm({
    initialValues: {
      state: true,
      name: '',
      amount: 0,
    },
    validate: zodResolver(TeamMemberCategorySchema),
    validateInputOnBlur: true,
  })

  const submitCategory = async (
    category: z.infer<typeof TeamMemberCategorySchema>
  ) => {
    const created = await insertCategory(category)

    if (created) {
      notifications.show({
        title: 'Categoría creada',
        message: 'Se creo correctamente la categoría',
        intent: 'success',
      })
      return startTransition(() => router.refresh())
    }

    notifications.show({
      title: 'Error',
      message: 'No se pudo crear la categoría',
      intent: 'error',
    })
    return startTransition(() => router.refresh())
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <ScriptPlus data-slot="icon" />
        Categoria
      </Button>

      <Dialog open={open} onClose={setOpen} size="2xl">
        <DialogTitle>Crear categoria</DialogTitle>
        <DialogDescription>
          Aquí puede crear una nueva categoria para luego asignarla a los
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
            </FieldGroup>
          </Fieldset>

          <DialogActions>
            <SubmitButton isLoading={isPending}>Crear categoria</SubmitButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
