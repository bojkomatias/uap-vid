'use client'
import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { Check, Selector } from 'tabler-icons-react'
import clsx from 'clsx'

const roles = [
    'Investigador',
    'Evaluador Interno',
    'Evaluador Externo',
    'Metodólogo',
    'Secretario de Investigación',
    'admin',
]

//Callback used in UpdateRole
export const RoleSelector = ({
    user,
    callback,
}: {
    user: any
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
                <>
                    <div className="relative mt-1 w-full">
                        <Listbox.Button className="input text-left">
                            <span className="">{user.role}</span>
                            <span className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-2">
                                <Selector
                                    className="text-gray-600 h-5 "
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
                            <Listbox.Options className="absolute z-10 mt-1 max-h-50 w-full overflow-auto bg-white py-1 text-base text-gray-600 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {roles.map((role) => (
                                    <Listbox.Option
                                        key={role}
                                        className={({ active }) =>
                                            clsx(
                                                active ? 'bg-gray-100' : '',
                                                'relative cursor-pointer select-none py-2 pl-3 pr-9 '
                                            )
                                        }
                                        value={role}
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
                                                    {role}
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
