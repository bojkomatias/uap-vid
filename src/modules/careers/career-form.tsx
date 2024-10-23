/* eslint-disable no-constant-condition */
'use client'

import { FieldGroup, Fieldset, FormActions } from '@components/fieldset'
import { notifications } from '@elements/notifications'
import { useForm, zodResolver } from '@mantine/form'
import { CareerSchema } from '@utils/zod'
import { useRouter } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import { FormInput } from '@shared/form/form-input'
import type { z } from 'zod'
import { SubmitButton } from '@shared/submit-button'
import { FormTextarea } from '@shared/form/form-textarea'
import type { Career, Course } from '@prisma/client'
import { upsertCareer } from '@repositories/career'
import { FormSwitch } from '@shared/form/form-switch'

export function CareerForm({
  career,
  onSubmitCallback,
}: {
  career: Career & { courses: Course[] }
  onSubmitCallback?: () => void
}) {
  const router = useRouter()

  const [isPending, startTransition] = useTransition()
  const form = useForm<z.infer<typeof CareerSchema>>({
    initialValues: {
      id: career.id,
      name: career.name,
      //This type assertion was the only way I could bypass the type mismatch between the input type and the proper type of the data model (string vs string[])
      courses: career.courses
        .map((x, index) => (index === 0 ? x.name : ` ${x.name}`))
        .join(', ') as unknown as string[],
      active: career.active,
    },
    transformValues: (values) => CareerSchema.parse(values),

    validate: zodResolver(CareerSchema),
  })

  const submitCareer = useCallback(
    async (career: z.infer<typeof CareerSchema>) => {
      const upserted = await upsertCareer(career)
      if (upserted)
        notifications.show({
          title: 'Carrera guardada',
          message: 'La carrera ha sido guardada con éxito',
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
        (values) => submitCareer(values)
      )}
      className="@container"
    >
      <Fieldset>
        <FieldGroup className="@xl:grid @xl:grid-cols-1 @xl:gap-6 @xl:space-y-0">
          <FormSwitch
            label="Estado de la carrera"
            description={
              form.getInputProps('active').value ? 'Activa' : 'Inactiva'
            }
            checked={form.getInputProps('active').value}
            {...form.getInputProps('active')}
          />

          <FormInput
            label="Nombre"
            description="Nombre de la carrera"
            placeholder="Contabilidad I"
            {...form.getInputProps('name')}
          />

          <FormTextarea
            label="Materias de la carrera"
            description="Puede copiar y pegar un listado de carreras, separadas con coma"
            rows={5}
            {...form.getInputProps('courses')}
            onChange={(e: any) => {
              form.setFieldValue('courses', e.target.value)
            }}
          />
        </FieldGroup>
      </Fieldset>

      <FormActions>
        <SubmitButton isLoading={isPending}>
          {!career.id ? 'Crear carrera' : 'Actualizar carrera'}
        </SubmitButton>
      </FormActions>
    </form>
  )
}
