'use client'
import { notifications } from '@elements/notifications'
import { Combobox } from '@headlessui/react'
import type { User } from '@prisma/client'
import { cx } from '@utils/cx'
import { useCallback, useState } from 'react'
import { Check, Selector } from 'tabler-icons-react'

let timeout: NodeJS.Timeout

type Props = {
    unitId: string
    secretaries: User[]
    currentSecretaries: string[]
    className?: string
}

export function SecretaryMultipleSelect({
    unitId,
    secretaries,
    currentSecretaries,
    className,
}: Props) {
    const [selected, setSelected] = useState(currentSecretaries)

    const updateSecretaries = useCallback(
        async (id: string, secretaries: string[]) => {
            const res = await fetch(`/api/academic-units/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ secretariesIds: secretaries }),
            })
            if (res.status === 200)
                return notifications.show({
                    title: 'Secretarios modificados',
                    message:
                        'Se actualizo la lista de secretarios para la unidad académica.',
                    intent: 'success',
                })
            notifications.show({
                title: 'Error',
                message: 'Ocurrió un error al actualizar los secretarios',
                intent: 'error',
            })
        },
        []
    )

    return (
        <Combobox
            //@ts-ignore
            multiple
            className={className}
            value={selected}
            onChange={(e) => {
                setSelected(e)
                clearTimeout(timeout)
                timeout = setTimeout(() => {
                    updateSecretaries(unitId, e)
                }, 1500)
            }}
        >
            <div className="relative">
                <Combobox.Button className="relative w-full">
                    <Combobox.Input
                        autoComplete="off"
                        className={'input pr-8 text-sm'}
                        placeholder="Secretarios..."
                        displayValue={(e: string[]) =>
                            e
                                .map(
                                    (j) =>
                                        secretaries.find((x) => x.id === j)
                                            ?.name
                                )
                                .filter(Boolean)
                                .join(', ')
                        }
                    />

                    <div className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none ">
                        <Selector
                            className="h-5 text-primary transition-all duration-200 hover:text-gray-400"
                            aria-hidden="true"
                        />
                    </div>
                </Combobox.Button>

                <Combobox.Options className="absolute z-20 mt-1.5 max-h-60 w-full overflow-auto rounded border  bg-white py-1 shadow focus:outline-none sm:text-sm">
                    {secretaries.map((secretary, index) => (
                        <Combobox.Option
                            key={index}
                            value={secretary.id}
                            className={({ active }) =>
                                cx(
                                    active ? 'bg-gray-100' : 'text-gray-600',
                                    'relative cursor-default select-none py-2 pl-8 pr-4'
                                )
                            }
                        >
                            {({ active, selected }) => (
                                <>
                                    <span
                                        className={cx(
                                            'block truncate',
                                            selected &&
                                                'font-semibold text-primary'
                                        )}
                                    >
                                        <span>{secretary.name}</span>
                                    </span>

                                    {selected && (
                                        <span
                                            className={cx(
                                                'absolute inset-y-0 left-0 flex items-center pl-1.5 text-primary',
                                                active && 'text-white'
                                            )}
                                        >
                                            <Check
                                                className="ml-1 h-4 w-4 text-gray-500"
                                                aria-hidden="true"
                                            />
                                        </span>
                                    )}
                                </>
                            )}
                        </Combobox.Option>
                    ))}
                </Combobox.Options>
            </div>
        </Combobox>
    )
}
