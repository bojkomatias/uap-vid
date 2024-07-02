'use client'

import { FieldGroup, Fieldset, FormActions } from '@components/fieldset'
import { notifications } from '@elements/notifications'
import { useForm, zodResolver } from '@mantine/form'
import { upsertConvocatory } from '@repositories/convocatory'
import { ConvocatorySchema } from '@utils/zod'
import { useRouter } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import { FormInput } from '@shared/form/form-input'
import type { z } from 'zod'
import { FormButton } from '@shared/form/form-button'

export function ConvocatoryForm({
  convocatory,
  onSubmitCallback,
}: {
  convocatory: z.infer<typeof ConvocatorySchema>
  onSubmitCallback?: () => void
}) {
  const router = useRouter()

  const [isPending, startTransition] = useTransition()
  const form = useForm<z.infer<typeof ConvocatorySchema>>({
    initialValues: {
      id: convocatory.id,
      name: convocatory.name,
      year: convocatory.year,
      // @ts-ignore -- I am transforming values later
      from: convocatory.from.toISOString().slice(0, 16),
      // @ts-ignore
      to: convocatory.to.toISOString().slice(0, 16),
    },
    transformValues: (values) => ({
      ...values,
      from: new Date(values.from),
      to: new Date(values.to),
    }),
    validate: zodResolver(ConvocatorySchema),
  })

  const submitConvocatory = useCallback(
    async (convocatory: z.infer<typeof ConvocatorySchema>) => {
      const upserted = await upsertConvocatory(convocatory)

      if (upserted)
        notifications.show({
          title: 'Convocatoria guardada',
          message: 'La convocatoria ha sido guardado con éxito',
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
    <form
      onSubmit={form.onSubmit(
        // @ts-ignore --Overriding values
        (values) => submitConvocatory(values)
      )}
    >
      <Fieldset>
        <FieldGroup>
          <FormInput
            label="Nombre"
            description="Nombre de la convocatoria"
            placeholder="Convocatoria 20XX"
            {...form.getInputProps('name')}
          />
          <FormInput
            label="Año"
            description="Año en la cual entraría en vigencia"
            type="number"
            {...form.getInputProps('year')}
            onChange={(e: any) =>
              form.setFieldValue('year', Number(e.target.value))
            }
          />
          <FormInput
            label="Desde"
            description="Fecha desde que comienza a correr"
            type="datetime-local"
            {...form.getInputProps('from')}
            onChange={(e: any) => form.setFieldValue('from', e.target.value)}
          />

          <FormInput
            label="Hasta"
            description="Fecha en la cual finzaliza"
            type="datetime-local"
            {...form.getInputProps('to')}
            onChange={(e: any) => form.setFieldValue('to', e.target.value)}
          />
        </FieldGroup>
      </Fieldset>

      <FormActions>
        <FormButton isLoading={isPending}>
          {!convocatory.id ? 'Crear convocatoria' : 'Actualizar convocatoria'}
        </FormButton>
      </FormActions>
    </form>
  )
}
