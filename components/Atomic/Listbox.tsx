import { Fragment, PropsWithChildren, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

const roles = [
    'Investigador',
    'Evaluador Interno',
    'Evaluador Externo',
    'Metodólogo',
    'Secretario de Investigación',
    'admin',
]

const ListBox = ({
    user,
    UpdateRoleForUser,
}: PropsWithChildren<{ user: any; UpdateRoleForUser: Function }>) => {
    return (
        <Listbox
            value={user.role}
            onChange={(e) => {
                user.role = e
                UpdateRoleForUser(user._id, e)
            }}
        >
            {({ open }) => (
                <>
                    <div className="relative mt-1 w-full">
                        <Listbox.Button className="input w-full">
                            <span className="block truncate">{user.role}</span>
                            <span className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-2">
                                <SelectorIcon
                                    className="text-gray-400 h-5 w-5 text-primary"
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
                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto bg-white py-1 text-base text-primary shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {roles.map((role) => (
                                    <Listbox.Option
                                        key={role}
                                        className={({ active }) =>
                                            classNames(
                                                active
                                                    ? 'font-normal'
                                                    : 'font-light',
                                                'relative cursor-pointer select-none py-2 pl-3 pr-9 '
                                            )
                                        }
                                        value={role}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span
                                                    className={classNames(
                                                        selected
                                                            ? 'font-bold'
                                                            : '',
                                                        'block truncate'
                                                    )}
                                                >
                                                    {role}
                                                </span>

                                                {selected ? (
                                                    <span
                                                        className={classNames(
                                                            active
                                                                ? 'text-primary'
                                                                : 'text-primary',
                                                            'absolute inset-y-0 right-0 flex items-center pr-4'
                                                        )}
                                                    >
                                                        <CheckIcon
                                                            className="h-5 w-5 text-primary"
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

export default ListBox
