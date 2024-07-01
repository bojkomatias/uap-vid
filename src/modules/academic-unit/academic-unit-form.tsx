'use client'

import { FieldGroup, Fieldset, FormActions } from '@components/fieldset'
import { notifications } from '@elements/notifications'
import { useForm, zodResolver } from '@mantine/form'
import { AcademicUnitSchema } from '@utils/zod'
import { useRouter } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import { FormInput } from '@shared/form/form-input'
import type { z } from 'zod'
import { FormButton } from '@shared/form/form-button'
import { upsertAcademicUnit } from '@repositories/academic-unit'

export function AcademicUnitForm({
  academicUnit,
  onSubmitCallback,
}: {
  academicUnit: z.infer<typeof AcademicUnitSchema>
  onSubmitCallback?: () => void
}) {
  const router = useRouter()

  const [isPending, startTransition] = useTransition()
  const form = useForm<z.infer<typeof AcademicUnitSchema>>({
    initialValues: academicUnit,
    validate: zodResolver(AcademicUnitSchema),
  })

  const submitAcademicUnit = useCallback(
    async (academicUnit: z.infer<typeof AcademicUnitSchema>) => {
      const upserted = await upsertAcademicUnit(academicUnit)

      if (upserted)
        notifications.show({
          title: 'Unidad académica guardada',
          message: 'La unidad académica ha sido guardado con éxito',
          intent: 'success',
        })

      startTransition(() => {
        router.refresh()
        if (onSubmitCallback) onSubmitCallback()
      })
    },
    [router, onSubmitCallback]
  )

  return (
    <form onSubmit={form.onSubmit((values) => submitAcademicUnit(values))}>
      <Fieldset>
        <FieldGroup>
          <FormInput
            label="Nombre"
            description="Nombre de la unidad académica"
            {...form.getInputProps('name')}
          />
          <FormInput
            label="Alias"
            description="Nombre corto de la unidad académica"
            {...form.getInputProps('shortname')}
          />
        </FieldGroup>
      </Fieldset>

      <FormActions>
        <FormButton isLoading={isPending}>
          {!academicUnit.id ?
            'Crear unidad académica'
          : 'Actualizar unidad académica'}
        </FormButton>
      </FormActions>
    </form>
  )
}
