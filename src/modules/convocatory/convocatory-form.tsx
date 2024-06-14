'use client'

import { FieldGroup, Fieldset, Legend } from '@components/fieldset'
import { Button } from '@elements/button'
import { notifications } from '@elements/notifications'
import { useForm, zodResolver } from '@mantine/form'
import type { Convocatory } from '@prisma/client'
import { createConvocatory, updateConvocatory } from '@repositories/convocatory'
import { cx } from '@utils/cx'
import { ConvocatorySchema } from '@utils/zod'
import { useRouter } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import { FormInput } from 'shared/form-input'

export function ConvocatoryForm({
  convocatory,
  isNew,
}: {
  convocatory: Omit<Convocatory, 'id' | 'createdAt'>
  isNew: boolean
  column?: boolean
}) {
  const router = useRouter()

  const [isPending, startTransition] = useTransition()
  const form = useForm<Omit<Convocatory, 'id' | 'createdAt'>>({
    initialValues: convocatory,
    transformValues: (values) => ({
      ...values,
      from: new Date(values.from),
      to: new Date(values.to),
    }),
    validate: zodResolver(ConvocatorySchema),
  })

  const upsertConvocatory = useCallback(
    async (convocatory: Omit<Convocatory, 'id' | 'createdAt'>) => {
      if (isNew) {
        const created = await createConvocatory(convocatory)

        if (created) {
          notifications.show({
            title: 'Convocatoria creada',
            message: 'La convocatoria ha sido creada con éxito',
            intent: 'success',
          })
          router.refresh()
          return router.push(`/convocatories`)
        }
        return notifications.show({
          title: 'Error al crear',
          message: 'Ocurrió un error al crear la convocatoria',
          intent: 'error',
        })
      }
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
    [isNew, router]
  )

  return (
    <form onSubmit={form.onSubmit((values) => upsertConvocatory(values))}>
      <Fieldset className="@container">
        <Legend>Datos de convocatoria</Legend>
        <FieldGroup className="grid gap-6 space-y-0 @xl:grid-cols-2">
          <FormInput
            label="Nombre"
            placeholder="Convocatoria 20XX"
            {...form.getInputProps('name')}
          />
          <FormInput
            label="Año"
            type="number"
            value={form.getInputProps('year').value}
            onChange={(e: any) =>
              form.setFieldValue('year', Number(e.target.value))
            }
          />
          <FormInput
            label="Fecha desde"
            type="datetime-local"
            defaultValue={new Date(form.getInputProps('from').value)
              .toISOString()
              .substring(0, 16)}
            onChange={(e: any) => form.setFieldValue('from', e.target.value)}
          />

          <FormInput
            label="Fecha hasta"
            type="datetime-local"
            defaultValue={new Date(form.getInputProps('to').value)
              .toISOString()
              .substring(0, 16)}
            onChange={(e: any) => form.setFieldValue('to', e.target.value)}
          />
        </FieldGroup>
      </Fieldset>
      <Button
        intent="secondary"
        type="submit"
        loading={isPending}
        className="float-right m-4 lg:col-start-2 lg:col-end-3 lg:place-self-end"
      >
        {isNew ? 'Crear convocatoria' : 'Actualizar convocatoria'}
      </Button>
    </form>
  )
}
