'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { notifications } from '@mantine/notifications'
import { Check, X } from 'tabler-icons-react'
import { Button } from '@elements/button'
import CurrencyInput from '@elements/currency-input'
import { useForm, zodResolver } from '@mantine/form'
import { TeamMemberCategorySchema } from '@utils/zod'
import type { z } from 'zod'
import { cx } from '@utils/cx'
import { useCustomNotification } from '@utils/notifications-hook'

/**The prop column is to set the content as columns instead of rows */
export default function CategoryForm({
    closeInterceptingDrawer,
    column = false,
}: {
    closeInterceptingDrawer?: Function
    column?: boolean
}) {
    const router = useRouter()
    const notificationHook = useCustomNotification()
    const form = useForm({
        initialValues: { state: true, name: '', price: [] },
        validate: zodResolver(TeamMemberCategorySchema),
        validateInputOnBlur: true,
    })

    const [loading, setLoading] = useState(false)

    const createCategory = async (
        category: z.infer<typeof TeamMemberCategorySchema>
    ) => {
        setLoading(true)
        const res = await fetch(`/api/categories`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(category),
        })
        if (res.status === 200) {
            notificationHook({
                title: 'Tu vieja',
                message: 'Pinga',
                intent: 'error',
                ms_duration: 5000,
            })
            setLoading(false)

            //Agregué un timeout porque era demasiado rápido el close
            setTimeout(() => {
                closeInterceptingDrawer && closeInterceptingDrawer(router)
                router.push('/categories')
            }, 500)
        } else if (res.status === 422) {
            notifications.show({
                title: 'Error',
                message: 'No se pudo crear la categoría',
                color: 'red',
                icon: <X />,
                radius: 0,
                style: {
                    marginBottom: '.8rem',
                },
            })
            setLoading(false)
        }
    }

    return (
        <form
            onSubmit={form.onSubmit((values) => createCategory(values))}
            className={cx(
                !column && 'mt-28 place-items-stretch lg:grid lg:grid-cols-2 ',
                'mx-auto  max-w-5xl pt-4 '
            )}
        >
            <div className="m-3 p-1">
                <label htmlFor="name" className="label">
                    Nombre
                </label>
                <input
                    id="name"
                    className="input"
                    placeholder="Nombre de la categoría"
                    {...form.getInputProps('name')}
                />
                {form.getInputProps('name').error ? (
                    <p className="error">*{form.getInputProps('name').error}</p>
                ) : null}
            </div>
            <div className="m-3 p-1">
                <label htmlFor="price" className="label">
                    Precio hora
                </label>
                <CurrencyInput
                    priceSetter={(e) => {
                        form.removeListItem('price', 0)
                        // Always delete the prior since only one exists on creation
                        form.insertListItem('price', {
                            price: e,

                            from: new Date(),
                            to: null,
                        })
                    }}
                />
                {form.getInputProps('price').error ||
                form.getInputProps('price.0.price').error ? (
                    <p className="error">
                        *{form.getInputProps('price').error}
                        {form.getInputProps('price.0.price').error}
                    </p>
                ) : null}
            </div>

            <Button
                intent="secondary"
                type="submit"
                className={cx(
                    column && 'mt-6',
                    ' m-4 ml-auto lg:col-start-2 lg:col-end-3 lg:place-self-end'
                )}
                loading={loading}
            >
                Crear categoría
            </Button>
        </form>
    )
}
