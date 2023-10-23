'use client'
import { Button } from '@elements/button'
import { notifications } from '@elements/notifications'
import { Listbox } from '@headlessui/react'
import { useForm } from '@mantine/form'
import type {
    HistoricTeamMemberCategory,
    TeamMember,
    TeamMemberCategory,
} from '@prisma/client'
import { cx } from '@utils/cx'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { Check, Selector } from 'tabler-icons-react'

export default function CategorizationForm({
    categories,
    historicCategories,
    member,
}: {
    categories: TeamMemberCategory[]
    historicCategories: HistoricTeamMemberCategory[]
    member: TeamMember
}) {
    const router = useRouter()

    const currentCategory = historicCategories.at(-1)
    const form = useForm({
        initialValues: { categoryId: currentCategory?.categoryId ?? '' },
    })

    const categorizeTeamMember = useCallback(
        async (newCategory: string) => {
            const data = {
                newCategory,
                expireId: currentCategory?.id,
                memberId: member.id,
            }
            const res = await fetch(`/api/team-members/${data.memberId}`, {
                method: 'PATCH',
                body: JSON.stringify(data),
            })
            if (res.status === 200) {
                notifications.show({
                    title: 'Categoría actualizada',
                    message:
                        'La categoría del miembro de investigación fue actualizada con éxito',
                    intent: 'success',
                })
                return router.refresh()
            }
            notifications.show({
                title: 'Ha ocurrido un error',
                message:
                    'Hubo un error al actualizar la categoría del miembro de investigación.',
                intent: 'error',
            })
        },
        [currentCategory?.id, member, router]
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
                    Recuerde que si es obrero, el calculo de sus puntos por el
                    valor de la categoría FMR será lo que determine sus
                    honorarios.
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
                        disabled={member.obrero}
                    >
                        <div className="relative mt-1 w-full">
                            <Listbox.Button
                                className={cx(
                                    'input text-left',
                                    member.obrero && 'bg-gray-100'
                                )}
                            >
                                <span className={'block truncate'}>
                                    {form.values.categoryId
                                        ? categories.find(
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
                                {categories.map((value) => (
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
                                                        ${' '}
                                                        {
                                                            value.price.at(-1)!
                                                                .price
                                                        }{' '}
                                                        {
                                                            value.price.at(-1)!
                                                                .currency
                                                        }{' '}
                                                        / hora
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
                <div className={cx(!form.isDirty() && 'hidden')}>
                    <div className="label">Categoría anterior</div>
                    <div className="ml-1 font-medium">
                        {currentCategory
                            ? categories.find(
                                  (e) => e.id === currentCategory.categoryId
                              )?.name
                            : null}
                    </div>
                </div>
            </div>
            <Button
                intent="secondary"
                type="submit"
                className="float-right"
                disabled={!form.isDirty()}
            >
                Actualizar categoría
            </Button>
        </form>
    )
}
