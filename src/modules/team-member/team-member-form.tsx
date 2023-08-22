'use client'
import { Badge } from '@elements/badge'
import { Button } from '@elements/button'
import { Combobox, Listbox, Transition } from '@headlessui/react'
import { useForm, zodResolver } from '@mantine/form'
import { TeamMemberCategory, User } from '@prisma/client'
import { cx } from '@utils/cx'
import RolesDictionary from '@utils/dictionaries/RolesDictionary'
import { TeamMemberSchema } from '@utils/zod'
import { Fragment, useState } from 'react'
import { Check, Selector, X } from 'tabler-icons-react'
import type { z } from 'zod'

const fakeCategories: TeamMemberCategory[] = [
    {
        id: 'adbcsd',
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
]

export default function TeamMemberForm({
    member,
    researchers,
}: {
    member: z.infer<typeof TeamMemberSchema>
    researchers: User[]
}) {
    const form = useForm({
        initialValues: member,
        validate: zodResolver(TeamMemberSchema),
    })

    const [query, setQuery] = useState('')

    const filteredPeople =
        query === ''
            ? researchers
            : researchers.filter((user) => {
                  return user.name.toLowerCase().includes(query.toLowerCase())
              })

    return (
        <div>
            <h3>{member.user?.name ?? member.name}</h3>
            <form
                onSubmit={form.onSubmit(
                    (values) => console.log(values),
                    (errors) => console.log(errors)
                )}
                className="mx-auto mt-20 max-w-5xl space-y-6"
            >
                <div>
                    <div className="mb-2 text-sm font-medium">
                        Relacioné un usuario con el miembro de investigación
                    </div>
                    <label htmlFor="select-user" className="label">
                        Usuario
                    </label>
                    <Combobox
                        as="div"
                        value={form.getInputProps('userId').value}
                        onChange={(e) => {
                            if (e !== null) form.setFieldValue('userId', e)
                        }}
                        className="relative z-10"
                    >
                        <Combobox.Button className="relative w-full">
                            <Combobox.Input
                                autoComplete="off"
                                className="input"
                                placeholder={`Seleccione un usuario`}
                                onChange={(e) => setQuery(e.target.value)}
                                displayValue={() =>
                                    researchers.find(
                                        (user) =>
                                            user.id ===
                                            form.getInputProps('userId').value
                                    )?.name ?? ''
                                }
                            />

                            <div className="absolute inset-y-0 right-0 flex items-center rounded-r-md pr-2 focus:outline-none">
                                <X
                                    className={cx(
                                        'h-6 w-6 rounded-full p-1 text-gray-400 transition-all duration-200 hover:scale-110 hover:bg-gray-100 hover:stroke-2 hover:text-gray-700 active:scale-95',
                                        form.getInputProps('userId').value ===
                                            ''
                                            ? 'hidden'
                                            : ''
                                    )}
                                    onClick={(e) => {
                                        form.setFieldValue('userId', '')
                                        e.stopPropagation()
                                    }}
                                    aria-hidden="true"
                                />
                                <Selector
                                    className="h-5 text-gray-600 hover:text-gray-400"
                                    aria-hidden="true"
                                />
                            </div>
                        </Combobox.Button>

                        {filteredPeople.length > 0 ? (
                            <Combobox.Options className="absolute z-10 mt-1.5 max-h-60 w-full overflow-auto rounded border bg-white py-1 text-sm shadow focus:outline-none">
                                {filteredPeople.map((value) => (
                                    <Combobox.Option
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
                                                    <Badge className="ml-4">
                                                        {
                                                            RolesDictionary[
                                                                value.role
                                                            ]
                                                        }
                                                    </Badge>
                                                    <span
                                                        title={value.email}
                                                        className={cx(
                                                            'ml-3 truncate text-xs font-light',
                                                            active
                                                                ? 'text-gray-700'
                                                                : 'text-gray-500'
                                                        )}
                                                    >
                                                        {value.email}
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
                                    </Combobox.Option>
                                ))}
                            </Combobox.Options>
                        ) : null}
                    </Combobox>
                </div>
                <div className="relative">
                    <div
                        className="absolute inset-0 flex items-center"
                        aria-hidden="true"
                    >
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white px-4 text-sm font-light text-gray-600">
                            O alternativamente
                        </span>
                    </div>
                </div>
                <div>
                    <div className="mb-2 text-sm font-medium">
                        Cree un nuevo miembro de investigación sin relación con
                        usuario existente.
                    </div>
                    <label htmlFor="name" className="label">
                        Nombre completo
                    </label>
                    <input
                        type="text"
                        className="input"
                        name="name"
                        disabled={form.getInputProps('userId').value}
                    />
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex-grow">
                        <label htmlFor="category" className="label">
                            Seleccione una categoría
                        </label>
                        <Listbox
                            value={form.getInputProps('category').value}
                            onChange={(e) => {
                                console.log(e)
                            }}
                        >
                            {({ open }) => (
                                <>
                                    <div className="relative mt-1 w-full max-w-xs">
                                        <Listbox.Button className="input text-left">
                                            <span className="">
                                                {
                                                    form.values?.categories?.at(
                                                        -1
                                                    )?.categoryId
                                                }
                                            </span>
                                            <span className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-2">
                                                <Selector
                                                    className="h-5 text-gray-600 "
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        </Listbox.Button>

                                        <Transition
                                            show={open}
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Listbox.Options className="max-h-50 absolute z-10 mt-1 w-full overflow-auto bg-white py-1 text-base text-gray-600 shadow-lg ring-1  focus:outline-none sm:text-sm">
                                                {fakeCategories.map((value) => (
                                                    <Listbox.Option
                                                        key={value.id}
                                                        className={({
                                                            active,
                                                        }) =>
                                                            cx(
                                                                'relative cursor-pointer select-none py-2 pl-3 pr-9',
                                                                active
                                                                    ? 'bg-gray-100'
                                                                    : ''
                                                            )
                                                        }
                                                        value={value}
                                                    >
                                                        {({
                                                            selected,
                                                            active,
                                                        }) => (
                                                            <>
                                                                <span
                                                                    className={cx(
                                                                        'block truncate',
                                                                        selected
                                                                            ? 'font-bold'
                                                                            : ''
                                                                    )}
                                                                >
                                                                    {value.name}
                                                                </span>

                                                                {selected ? (
                                                                    <span
                                                                        className={cx(
                                                                            'absolute inset-y-0 right-0 flex items-center pr-4',
                                                                            active
                                                                                ? 'text-primary'
                                                                                : ''
                                                                        )}
                                                                    >
                                                                        <Check
                                                                            className="h-5  text-primary"
                                                                            aria-hidden="true"
                                                                        />
                                                                    </span>
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </>
                            )}
                        </Listbox>
                    </div>
                    <div className="mt-4 text-sm font-semibold">
                        Categoría previa:{' '}
                        {form.values?.categories?.at(-2)?.categoryId}
                    </div>
                </div>

                <div className="ml-2 mt-6 flex h-6 items-center">
                    <input
                        id="obrero"
                        name="obrero"
                        type="checkbox"
                        className="h-4 w-4 rounded-md  text-primary focus:ring-primary"
                        {...form.getInputProps('obrero' + 'humanAnimalOrDb', {
                            type: 'checkbox',
                        })}
                    />
                    <div className="ml-3 mt-0.5 text-sm leading-6">
                        <label
                            htmlFor="obrero"
                            className="label pointer-events-auto"
                        >
                            Obrero
                        </label>
                    </div>
                </div>
                <Button
                    intent="secondary"
                    type="submit"
                    className="float-right"
                >
                    {member.id
                        ? 'Guardar miembro'
                        : 'Crear miembro de investigación'}
                </Button>
            </form>
        </div>
    )
}
