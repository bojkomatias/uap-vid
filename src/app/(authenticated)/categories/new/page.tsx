'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { notifications } from '@mantine/notifications'
import { Check, X } from 'tabler-icons-react'
import { Button } from '@elements/button'
import type { HistoricCategoryPrice } from '@prisma/client'
import CurrencyInput, { parseLocaleNumber } from '@elements/currency-input'

export default function CategoryForm() {
    const router = useRouter()
    const [category, setCategory] = useState({ state: true })

    const [loading, setLoading] = useState(false)

    const createCategory = async () => {
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
                message: 'Nueva cateogría creada correctamente',
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
            onSubmit={(e) => {
                e.preventDefault()
                createCategory()
            }}
            className="mx-auto mt-28 max-w-5xl place-items-stretch lg:grid lg:grid-cols-2"
        >
            <div className="m-3 p-1">
                <label htmlFor="name" className="label">
                    Nombre
                </label>
                <input
                    id="name"
                    required
                    className="input"
                    type="text"
                    name="name"
                    placeholder="Nombre de la categoría"
                    onChange={(e) =>
                        setCategory({
                            ...category,
                            [e.target.name]: e.target.value,
                        })
                    }
                />
            </div>
            <div className="m-3 p-1">
                <label htmlFor="price" className="label">
                    Precio hora
                </label>

                <CurrencyInput
                    priceSetter={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setCategory({
                            ...category,
                            [e.target.name]: [
                                {
                                    from: new Date(),
                                    price:
                                        parseLocaleNumber(
                                            e.target.value,
                                            'de-DE'
                                        ) * 10,
                                    //No le paso la currency porque está por default en ARS.
                                },
                            ] as HistoricCategoryPrice[],
                        })
                    }
                />
            </div>

            <Button
                intent="secondary"
                type="submit"
                className="float-right m-4 lg:col-start-2 lg:col-end-3 lg:place-self-end"
            >
                {loading ? (
                    <span className="loader-primary h-5 w-5"></span>
                ) : (
                    'Crear categoría'
                )}
            </Button>
        </form>
    )
}
