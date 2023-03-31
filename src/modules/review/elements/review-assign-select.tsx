'use client'
import { Combobox, Listbox, Transition } from '@headlessui/react'
import { useNotifications } from '@mantine/notifications'
import { Review, ReviewType, User } from '@prisma/client'
import { EvaluatorsByReviewType } from '@utils/dictionaries/EvaluatorsDictionary'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { Fragment, useState } from 'react'
import { Selector, Check } from 'tabler-icons-react'

interface ReviewAssignSelectProps {
    type: ReviewType
    users: User[]
    review: Review | null
    protocolId: string
}

const ReviewAssignSelect = ({
    type,
    users,
    review,
    protocolId,
}: ReviewAssignSelectProps) => {
    const notification = useNotifications()
    const router = useRouter()

    const changeState = async (reviewerId: string) => {
        // Validate if the same value, if it is don't update
        if (review?.reviewerId === reviewerId) return
        const assigned = await fetch(`/api/protocol/${protocolId}/assign`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                review: review ?? null,
                reviewerId: reviewerId,
                type: type,
            }),
        })
        if (assigned.ok) {
            notification.showNotification({
                title: 'Evaluador asignado',
                message: 'El evaluador ha sido asignado con éxito',
                color: 'green',
            })
            return router.refresh()
        }
        return notification.showNotification({
            title: 'No hemos podido asignar el evaluador',
            message: 'Lo lamentamos, ha ocurrido un error',
            color: 'red',
        })
    }

    const [query, setQuery] = useState('')

    const filteredPeople =
        query === ''
            ? users
            : users.filter((person) => {
                  return person.name.toLowerCase().includes(query.toLowerCase())
              })

    return (
        <Combobox
            as="div"
            value={review?.reviewerId ?? null}
            onChange={(e) => {
                if (e !== null) changeState(e)
            }}
        >
            <div className="relative">
                <Combobox.Button className="relative w-full">
                    <Combobox.Input
                        autoComplete="off"
                        className="input form-input"
                        placeholder={`Seleccione un  ${EvaluatorsByReviewType[
                            type
                        ].toLocaleLowerCase()}`}
                        onChange={(e) => setQuery(e.target.value)}
                        displayValue={() =>
                            users.find((user) => user.id === review?.reviewerId)
                                ?.name ?? ''
                        }
                    />

                    <div className="absolute inset-y-0 right-0 flex items-center rounded-r-md pr-2 focus:outline-none">
                        <Selector
                            className="h-5 text-primary transition-all duration-200 hover:text-base-400"
                            aria-hidden="true"
                        />
                    </div>
                </Combobox.Button>

                {filteredPeople.length > 0 && (
                    <Combobox.Options className="z-20 mt-1.5 max-h-60 w-full overflow-auto rounded border border-gray-300 bg-white py-1 text-base shadow focus:outline-none sm:text-sm">
                        {filteredPeople.map((value) => (
                            <Combobox.Option
                                key={value.id}
                                value={value.id}
                                className={({ active }) =>
                                    clsx(
                                        'relative cursor-default select-none py-2 pl-8 pr-4',
                                        active ? 'bg-gray-100' : 'text-base-600'
                                    )
                                }
                            >
                                {({ active, selected }) => (
                                    <>
                                        <span className="block truncate">
                                            <span
                                                className={clsx(
                                                    selected &&
                                                        'font-semibold text-primary'
                                                )}
                                            >
                                                {value.name}
                                            </span>
                                            <span
                                                className={clsx(
                                                    'ml-2 truncate text-gray-500',
                                                    active
                                                        ? 'text-indigo-200'
                                                        : 'text-gray-500'
                                                )}
                                            >
                                                {value.email}
                                            </span>
                                        </span>

                                        {selected && (
                                            <span
                                                className={clsx(
                                                    'absolute inset-y-0 left-0 flex items-center pl-1.5 text-primary',
                                                    active ? 'text-white' : ''
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
                )}
            </div>
        </Combobox>
    )
}

export default ReviewAssignSelect