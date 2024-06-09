'use client'
import { Button } from '@elements/button'
import { notifications } from '@elements/notifications'
import { useForm, zodResolver } from '@mantine/form'
import type { Convocatory } from '@prisma/client'
import { createConvocatory, updateConvocatory } from '@repositories/convocatory'
import { cx } from '@utils/cx'
import { ConvocatorySchema } from '@utils/zod'
import { useRouter } from 'next/navigation'
import { useCallback, useTransition } from 'react'

export function ConvocatoryForm({
    convocatory,
    isNew,
    column = false,
}: {
    convocatory: Convocatory
    isNew: boolean
    column?: boolean
}) {
    const router = useRouter()

    const [isPending, startTransition] = useTransition()
    const form = useForm<Convocatory>({
        initialValues: convocatory,
        transformValues: (values) => ({
            ...values,
            from: new Date(values.from),
            to: new Date(values.to),
        }),
        validate: zodResolver(ConvocatorySchema),
    })

    const upsertConvocatory = useCallback(
        async (convocatory: Convocatory) => {
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

            const updated = await updateConvocatory(convocatory)

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
        <form
            onSubmit={form.onSubmit((values) => upsertConvocatory(values))}
            className={cx(
                column
                    ? 'flex flex-col gap-1'
                    : 'mx-auto mt-8 max-w-5xl place-items-stretch gap-3 lg:grid lg:grid-cols-2'
            )}
        >
            <div className="p-1">
                <label className="label">Nombre</label>
                <input
                    className="input"
                    type="text"
                    placeholder="Convocatoria - AAAA"
                    {...form.getInputProps('name')}
                />
                {form.getInputProps('name').error && (
                    <p className=" pl-3 pt-1 text-xs text-gray-600 saturate-[80%]">
                        *{form.getInputProps('name').error}
                    </p>
                )}
            </div>
            <div className=" p-1">
                <label className="label">Año</label>
                <input
                    className="input"
                    type="number"
                    value={form.getInputProps('year').value}
                    onChange={(e) =>
                        form.setFieldValue('year', Number(e.target.value))
                    }
                />
                {form.getInputProps('year').error && (
                    <p className=" pl-3 pt-1 text-xs text-gray-600 saturate-[80%]">
                        *{form.getInputProps('year').error}
                    </p>
                )}
            </div>

            <div className="p-1">
                <label className="label">Fecha desde</label>
                <input
                    type="datetime-local"
                    className="input"
                    defaultValue={new Date(form.getInputProps('from').value)
                        .toISOString()
                        .substring(0, 16)}
                    // @ts-ignore
                    onChange={(e) => form.setFieldValue('from', e.target.value)}
                />
                {form.getInputProps('from').error && (
                    <p className=" pl-3 pt-1 text-xs text-gray-600 saturate-[80%]">
                        *{form.getInputProps('from').error}
                    </p>
                )}
            </div>
            <div className=" p-1">
                <label className="label">Fecha hasta</label>
                <input
                    type="datetime-local"
                    className="input"
                    placeholder="Desde"
                    defaultValue={new Date(form.getInputProps('to').value)
                        .toISOString()
                        .substring(0, 16)}
                    // @ts-ignore
                    onChange={(e) => form.setFieldValue('to', e.target.value)}
                />

                {form.getInputProps('to').error && (
                    <p className=" pl-3 pt-1 text-xs text-gray-600 saturate-[80%]">
                        *{form.getInputProps('to').error}
                    </p>
                )}
            </div>

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
