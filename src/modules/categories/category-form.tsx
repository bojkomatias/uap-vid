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

export default function CategoryForm() {
    const router = useRouter()

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
            notifications.show({
                title: 'Categoría creada',
                message: 'Nueva categoría creada correctamente',
                color: 'success',
                icon: <Check />,
                radius: 0,
                style: {
                    marginBottom: '.8rem',
                },
            })
            setLoading(false)
            router.refresh()
            router.push('/categories')
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
            className="mx-auto mt-28 max-w-5xl place-items-stretch lg:grid lg:grid-cols-2"
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
                    priceSetter={(price: number) => {
                        form.removeListItem('price', 0)
                        // Always delete the prior since only one exists on creation
                        form.insertListItem('price', {
                            price: price,
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
                className="float-right m-4 lg:col-start-2 lg:col-end-3 lg:place-self-end"
                loading={loading}
            >
                Crear categoría
            </Button>
        </form>
    )
}
