'use client'
import { Listbox, Transition } from '@headlessui/react'
import { Review, ReviewType, User } from '@prisma/client'
import { EvaluatorsByReviewType } from '@utils/dictionaries/EvaluatorsDictionary'
import clsx from 'clsx'
import { Fragment } from 'react'
import { Selector, Check } from 'tabler-icons-react'

interface ReviewAssignSelectProps {
    type: ReviewType
    users: User[]
    review: Review | null
    enabled: boolean
    protocolId: string
}

const ReviewAssignSelect = ({
    type,
    users,
    review,
    protocolId,
    enabled,
}: ReviewAssignSelectProps) => {
    return (
        <Listbox
            value={review?.reviewerId ?? null}
            disabled={!review || !enabled}
            onChange={(e) => {
                console.log(e)
            }}
        >
            {({ open }) => (
                <>
                    <div className="relative mt-1 w-full">
                        <Listbox.Button className="input text-left">
                            <span className="">
                                {users.find(
                                    (user) => user.id === review?.reviewerId
                                )?.name ??
                                    `Seleccione un  ${EvaluatorsByReviewType[
                                        type
                                    ].toLocaleLowerCase()}`}
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
                            <Listbox.Options className="max-h-50 absolute z-10 mt-1 w-full overflow-auto bg-white py-1 text-base text-gray-600 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {users.map((user) => (
                                    <Listbox.Option
                                        key={user.id}
                                        className={({ active }) =>
                                            clsx(
                                                active ? 'bg-gray-100' : '',
                                                'relative cursor-pointer select-none py-2 pl-3 pr-9 '
                                            )
                                        }
                                        value={user.id}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span
                                                    className={clsx(
                                                        selected
                                                            ? 'font-bold'
                                                            : '',
                                                        'block truncate'
                                                    )}
                                                >
                                                    {user.name}
                                                </span>

                                                {selected ? (
                                                    <span
                                                        className={clsx(
                                                            active
                                                                ? 'text-primary'
                                                                : 'text-primary',
                                                            'absolute inset-y-0 right-0 flex items-center pr-4'
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
    )
}

export default ReviewAssignSelect
