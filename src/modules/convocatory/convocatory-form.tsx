'use client'

import { FieldGroup, Fieldset, FormActions, Legend } from '@components/fieldset'
import { notifications } from '@elements/notifications'
import { useForm, zodResolver } from '@mantine/form'
import { createConvocatory, updateConvocatory } from '@repositories/convocatory'
import { ConvocatorySchema } from '@utils/zod'
import { useRouter } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import { FormInput } from '@shared/form/form-input'
import { Button } from '@components/button'
import type { z } from 'zod'

export function ConvocatoryForm({
  convocatory,
}: {
  convocatory: z.infer<typeof ConvocatorySchema>
}) {
  const router = useRouter()

  const [isPending, startTransition] = useTransition()
  const form = useForm<z.infer<typeof ConvocatorySchema>>({
    initialValues: convocatory,
    transformValues: (values) => ({
      ...values,
      from: new Date(values.from),
      to: new Date(values.to),
    }),
    validate: zodResolver(ConvocatorySchema),
  })

  const upsertConvocatory = useCallback(
    async (convocatory: z.infer<typeof ConvocatorySchema>) => {
      /* If has no ID is a new category, so we create */
      if (!convocatory.id) {
        const created = await createConvocatory(convocatory)

        if (created) {
          notifications.show({
            title: 'Convocatoria creada',
            message: 'La convocatoria ha sido creada con éxito',
            intent: 'success',
          })

          return router.push(`/convocatories`)
        }
        return notifications.show({
          title: 'Error al crear',
          message: 'Ocurrió un error al crear la convocatoria',
          intent: 'error',
        })
      }

      /* Else if it has ID, we update existing one */

      // @ts-ignore
      const updated = await updateConvocatory(convocatory.id, convocatory)

      if (updated) {
        notifications.show({
          title: 'Convocatoria guardada',
          message: 'La convocatoria ha sido guardado con éxito',
          intent: 'success',
        })
        return startTransition(() => router.refresh())
      }
      return notifications.show({
        title: 'Error al actualizar',
        message: 'Ocurrió un error al actualizar la convocatoria',
        intent: 'error',
      })
    },
    [router]
  )

  return (
    <form
      onSubmit={form.onSubmit(
        (values) => upsertConvocatory(values),
        (errors) => console.log(errors)
      )}
      className="@container"
    >
      <Fieldset>
        <FieldGroup className="@2xl:grid @2xl:grid-cols-2 @2xl:gap-6 @2xl:space-y-0">
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
        <Button type="submit">
          {!convocatory.id ? 'Crear convocatoria' : 'Actualizar convocatoria'}
        </Button>
      </FormActions>
    </form>
  )
}
