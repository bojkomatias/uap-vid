'use client'
import { Button } from '@elements/button'
import { useForm, zodResolver } from '@mantine/form'
import { useNotifications } from '@mantine/notifications'
import { Convocatory, ConvocatorySchema } from '@utils/zod'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { Check } from 'tabler-icons-react'

export function ConvocatoryForm({
    convocatory,
    isNew,
}: {
    convocatory: Convocatory
    isNew: boolean
}) {
    const router = useRouter()
    const notifications = useNotifications()

    const form = useForm<Convocatory>({
        initialValues: convocatory,
        validate: zodResolver(ConvocatorySchema),
    })

    const upsertConvocatory = useCallback(
        async (convocatory: Convocatory) => {
            if (isNew) {
                const res = await fetch(`/api/convocatory`, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(convocatory),
                })

                if (res.status === 200) {
                    notifications.showNotification({
                        title: 'Convocatoria creada',
                        message: 'La convocatoria ha sido creada con éxito',
                        color: 'teal',
                        icon: <Check />,
                        radius: 0,
                        style: {
                            marginBottom: '.8rem',
                        },
                    })
                }
                return router.push(`/convocatories`)
            }
            const res = await fetch(`/api/convocatory/${convocatory.id}`, {
                method: 'PUT',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(convocatory),
            })

            if (res.status === 200) {
                notifications.showNotification({
                    title: 'Convocatoria guardado',
                    message: 'La convocatoria ha sido guardado con éxito',
                    color: 'teal',
                    icon: <Check />,
                    radius: 0,
                    style: {
                        marginBottom: '.8rem',
                    },
                })
                router.push('/convocatories')
            }
        },
        [isNew, notifications, router]
    )

    return (
        <form
            onSubmit={form.onSubmit(
                (values) => console.log(values),
                (errors) => console.log(errors)
            )}
            className="mx-auto mt-24 max-w-5xl place-items-stretch lg:grid lg:grid-cols-2"
        >
            <div className="m-3 p-1">
                <label className="label">Nombre</label>
                <input
                    className="input"
                    type="text"
                    placeholder="Convocatoria - AAAA"
                    {...form.getInputProps('name')}
                />
            </div>
            <div className="m-3 p-1">
                <label className="label">Año</label>
                <input
                    className="input"
                    type="number"
                    {...form.getInputProps('year')}
                />
            </div>
            <div className="m-3 p-1">
                <label className="label">Fecha desde</label>
                <input
                    className="input"
                    type="input"
                    {...form.getInputProps('from')}
                />
            </div>
            <div className="m-3 p-1">
                <label className="label">Fecha hasta</label>
                <input
                    className="input"
                    type="input"
                    {...form.getInputProps('to')}
                />
            </div>
            <Button
                type="submit"
                className="float-right m-4 lg:col-start-2 lg:col-end-3 lg:place-self-end"
            >
                {isNew ? 'Crear convocatoria' : 'Actualizar convocatoria'}
            </Button>
        </form>
    )
}
