'use client'
import { Button } from '@elements/button'
import { notifications } from '@elements/notifications'
import { DateTimePicker } from '@mantine/dates'
import { useForm, zodResolver } from '@mantine/form'
import type { Convocatory } from '@utils/zod'
import { ConvocatorySchema } from '@utils/zod'
import 'dayjs/locale/es'
import { useRouter } from 'next/navigation'
import { useCallback, useTransition } from 'react'

export function ConvocatoryForm({
    convocatory,
    isNew,
}: {
    convocatory: Convocatory
    isNew: boolean
}) {
    const router = useRouter()

    const [isPending, startTransition] = useTransition()
    const form = useForm<Convocatory>({
        initialValues: convocatory,
        validate: zodResolver(ConvocatorySchema),
    })

    const upsertConvocatory = useCallback(
        async (convocatory: Convocatory) => {
            if (isNew) {
                const res = await fetch(`/api/convocatories`, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(convocatory),
                })

                if (res.status === 200) {
                    notifications.show({
                        title: 'Convocatoria creada',
                        message: 'La convocatoria ha sido creada con éxito',
                        intent: 'success',
                    })
                }
                router.refresh()
                return router.push(`/convocatories`)
            }
            const res = await fetch(`/api/convocatories/${convocatory.id}`, {
                method: 'PUT',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(convocatory),
            })

            if (res.status === 200) {
                notifications.show({
                    title: 'Convocatoria guardada',
                    message: 'La convocatoria ha sido guardado con éxito',
                    intent: 'success',
                })
                startTransition(() => router.refresh())
            }
        },
        [isNew, router]
    )

    return (
        <form
            onSubmit={form.onSubmit((values) => upsertConvocatory(values))}
            className="mx-auto mt-8 max-w-5xl place-items-stretch lg:grid lg:grid-cols-2"
        >
            <div className="m-3 p-1">
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
            <div className="m-3 p-1">
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

            <div className="m-3 p-1">
                <DateTimePicker
                    firstDayOfWeek={0}
                    valueFormat="DD/MM/YYYY HH:mm"
                    locale="es"
                    label="Fecha desde"
                    placeholder="Desde"
                    classNames={{
                        input: 'input',
                        label: 'label',
                    }}
                    value={new Date(form.getInputProps('from').value)}
                    onChange={(e) => form.setFieldValue('from', e!)}
                />
                {form.getInputProps('from').error && (
                    <p className=" pl-3 pt-1 text-xs text-gray-600 saturate-[80%]">
                        *{form.getInputProps('from').error}
                    </p>
                )}
            </div>
            <div className="m-3 p-1">
                <DateTimePicker
                    minDate={new Date()}
                    firstDayOfWeek={0}
                    valueFormat="DD/MM/YYYY HH:mm"
                    locale="es"
                    label="Fecha hasta"
                    placeholder="Hasta"
                    classNames={{
                        input: 'input',
                        label: 'label',
                    }}
                    value={new Date(form.getInputProps('to').value)}
                    onChange={(e) => form.setFieldValue('to', e!)}
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
