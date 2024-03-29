'use client'
import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { Check, Selector } from 'tabler-icons-react'
import { cx } from '@utils/cx'
import RolesDictionary from '@utils/dictionaries/RolesDictionary'
import type { Role, User } from '@prisma/client'

//Callback used in UpdateRole
export const RoleSelector = ({
    user,
    callback,
}: {
    user: User | { role: Role } // new User only should have pre-selected
    callback?: Function
}) => {
    return (
        <Listbox
            value={user.role}
            onChange={(e) => {
                user.role = e
                if (callback) callback(e)
            }}
        >
            {({ open }) => (
                <div className="mt-1 w-full max-w-xs">
                    <Listbox.Button className="input relative text-left ">
                        <span className="">{RolesDictionary[user.role]}</span>
                        <span className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-2">
                            <Selector
                                className="h-4 text-gray-600"
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
                        <Listbox.Options className="max-h-50 absolute z-10 mt-1 w-full max-w-xs overflow-auto rounded-md bg-white py-1 text-base text-gray-600 shadow-lg ring-1 focus:outline-none sm:text-sm">
                            {Object.entries(RolesDictionary).map(
                                ([key, role]) => (
                                    <Listbox.Option
                                        key={key}
                                        className={({ active }) =>
                                            cx(
                                                'relative cursor-pointer select-none py-2 pl-3 pr-9',
                                                active ? 'bg-gray-100' : ''
                                            )
                                        }
                                        value={key}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span
                                                    className={cx(
                                                        'block truncate',
                                                        selected
                                                            ? 'font-bold'
                                                            : ''
                                                    )}
                                                >
                                                    {role}
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
                                                            className="h-4 text-primary"
                                                            aria-hidden="true"
                                                        />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Listbox.Option>
                                )
                            )}
                        </Listbox.Options>
                    </Transition>
                </div>
            )}
        </Listbox>
    )
}
