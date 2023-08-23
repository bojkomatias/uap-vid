'use client'

import { Button } from '@elements/button'
import { Listbox } from '@headlessui/react'
import { useForm, zodResolver } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import type {
    HistoricTeamMemberCategory,
    TeamMemberCategory,
} from '@prisma/client'
import { cx } from '@utils/cx'
import { HistoricTeamMemberCategorySchema } from '@utils/zod'
import { useRouter } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import { Check, Selector, X } from 'tabler-icons-react'

const fakeCategories: TeamMemberCategory[] = [
    {
        id: '64e50b5ac2dfc1274a001a63',
        name: 'Categoria V',
        price: [
            {
                from: new Date('27/02/1996'),
                price: 1250,
                currrency: 'ARS',
                to: new Date('27/05/2023'),
            },
        ],
    },
    {
        id: '64e50b7cc2dfc1274a001a64',
        name: 'Categoria IV',
        price: [
            {
                from: new Date('27/02/1996'),
                price: 1250,
                currrency: 'ARS',
                to: new Date('27/05/2023'),
            },
        ],
    },
]

export default function CategorizationForm({
    categories,
    memberId,
}: {
    categories: HistoricTeamMemberCategory[]
    memberId: string
}) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const currentCategory = categories.at(-1)
    const form = useForm({
        initialValues: { categoryId: currentCategory?.categoryId ?? '' },
    })

    const categorizeTeamMember = useCallback(
        async (newCategory: string) => {
            const data = {
                newCategory,
                expireId: currentCategory?.id,
                memberId,
            }
            const res = await fetch(`/api/team-members/${memberId}`, {
                method: 'PATCH',
                body: JSON.stringify(data),
            })
            if (res.status === 200) {
                notifications.show({
                    title: 'Categoría actualizada',
                    message:
                        'La categoría del miembro de investigación fue actualizada con éxito',
                    color: 'success',
                    icon: <Check />,
                    radius: 0,
                    style: {
                        marginBottom: '.8rem',
                    },
                })

                return startTransition(() => router.refresh())
            }
            notifications.show({
                title: 'Ha ocurrido un error',
                message:
                    'Hubo un error al actualizar la categoría del miembro de investigación.',
                color: 'red',
                icon: <X />,
                radius: 0,
                style: {
                    marginBottom: '.8rem',
                },
            })
        },
        [currentCategory?.id, memberId, router]
    )

    return (
        <form
            onSubmit={form.onSubmit((values) =>
                categorizeTeamMember(values.categoryId)
            )}
            className="mx-auto mt-20 max-w-5xl space-y-6"
        >
            <div className="mb-2 text-sm font-medium">
                Categorize al docente según corresponda.
                <div className="font-light italic text-gray-700">
                    Recuerde que si es obrero, ese dato será utilizado para el
                    calculo de sus honorarios.
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div className="flex-grow">
                    <label htmlFor="categories" className="label">
                        Seleccione una categoría
                    </label>
                    <Listbox
                        value={form.getInputProps('categoryId').value}
                        onChange={(e) => {
                            form.setFieldValue('categoryId', e)
                        }}
                    >
                        <div className="relative mt-1 w-full">
                            <Listbox.Button className="input text-left">
                                <span className="block truncate">
                                    {form.values.categoryId
                                        ? fakeCategories.find(
                                              (e) =>
                                                  e.id ===
                                                  form.values.categoryId
                                          )?.name
                                        : '-'}
                                </span>
                                <span className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-2">
                                    <Selector
                                        className="h-5 text-gray-600 "
                                        aria-hidden="true"
                                    />
                                </span>
                            </Listbox.Button>

                            <Listbox.Options className="absolute z-10 mt-1.5 max-h-60 w-full overflow-auto rounded border bg-white py-1 text-sm shadow focus:outline-none">
                                {fakeCategories.map((value) => (
                                    <Listbox.Option
                                        key={value.id}
                                        value={value.id}
                                        className={({ active }) =>
                                            cx(
                                                'relative cursor-default select-none py-2 pl-8 pr-2',
                                                active
                                                    ? 'bg-gray-100'
                                                    : 'text-gray-600'
                                            )
                                        }
                                    >
                                        {({ active, selected }) => (
                                            <>
                                                <span className="block truncate font-medium">
                                                    <span
                                                        className={cx(
                                                            active &&
                                                                'text-gray-800',
                                                            selected &&
                                                                'text-primary'
                                                        )}
                                                    >
                                                        {value.name}
                                                    </span>

                                                    <span
                                                        className={cx(
                                                            'ml-3 truncate text-xs font-light',
                                                            active
                                                                ? 'text-gray-700'
                                                                : 'text-gray-500'
                                                        )}
                                                    >
                                                        {value.price[0].price}
                                                    </span>
                                                </span>

                                                {selected && (
                                                    <span
                                                        className={cx(
                                                            'absolute inset-y-0 left-0 flex items-center pl-2 text-primary',
                                                            active
                                                                ? 'text-white'
                                                                : ''
                                                        )}
                                                    >
                                                        <Check
                                                            className="h-4 w-4 text-gray-500"
                                                            aria-hidden="true"
                                                        />
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </div>
                    </Listbox>
                </div>
                <div className={cx("mt-4 w-48 text-sm font-semibold",!form.isDirty() && 'hidden')}>
                    Categoría actual:
                    <div className="font-medium">
                        {currentCategory
                            ? fakeCategories.find(
                                  (e) => e.id === currentCategory.categoryId
                              )?.name
                            : '-'}
                    </div>
                </div>
            </div>
            <Button
                intent="secondary"
                type="submit"
                className="float-right"
                loading={isPending}
                disabled={!form.isDirty()}
            >
                Actualizar categoría
            </Button>
        </form>
    )
}
