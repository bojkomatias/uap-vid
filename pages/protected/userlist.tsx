/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'

const roles = ['new-user', 'external']

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

function UserList({ users }: any) {
    const UpdateRoleForUser = async (id: any, newRole: string) => {
        console.log(id, newRole)
        const res = await fetch(`/api/users/${id}`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ role: newRole }),
        })
        console.log(await res.json())
    }
    return (
        <div>
            {users.map((user: any) => (
                <div key={user.email} className="p-10 text-primary">
                    <div className="flex items-center justify-around gap-6 text-xl font-bold">
                        <p>Email</p>
                        <p className="-translate-x-8">
                            Último inicio de sesión
                        </p>
                        <p className="-translate-x-10">Rol</p>
                    </div>
                    <div className="flex items-center justify-around gap-6">
                        <p>{user.email}</p>
                        <div className="flex gap-3">
                            {' '}
                            <p>
                                {new Date(user.lastLogin).toLocaleDateString(
                                    'es-ar'
                                )}
                            </p>
                            <p>
                                {new Date(user.lastLogin).toLocaleTimeString(
                                    'es-ar'
                                )}
                            </p>
                        </div>

                        <Listbox
                            value={user.role}
                            onChange={(e) => {
                                user.role = e
                                UpdateRoleForUser(user._id, e)
                            }}
                        >
                            {({ open }) => (
                                <>
                                    <div className="relative mt-1">
                                        <Listbox.Button className="input w-40">
                                            <span className="block truncate">
                                                {user.role}
                                            </span>
                                            <span className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-2">
                                                <SelectorIcon
                                                    className="text-gray-400 h-5 w-5"
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
                                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 hover:text-base-600 focus:outline-none sm:text-sm">
                                                {roles.map((role) => (
                                                    <Listbox.Option
                                                        key={role}
                                                        className={({
                                                            active,
                                                        }) =>
                                                            classNames(
                                                                active
                                                                    ? 'font-bold text-primary'
                                                                    : 'hover:font-bold',
                                                                'relative cursor-pointer select-none py-2 pl-3 pr-9 '
                                                            )
                                                        }
                                                        value={role}
                                                    >
                                                        {({
                                                            selected,
                                                            active,
                                                        }) => (
                                                            <>
                                                                <span
                                                                    className={classNames(
                                                                        selected
                                                                            ? 'font-semibold'
                                                                            : 'font-normal',
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
                                                                                : 'text-indigo-600',
                                                                            'absolute inset-y-0 right-0 flex items-center pr-4'
                                                                        )}
                                                                    >
                                                                        <CheckIcon
                                                                            className="h-5 w-5"
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
                </div>
            ))}
        </div>
    )
}

export default UserList

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async () => {
    const string = `${process.env.NEXTURL}/api/users/`
    const data = await fetch(string).then((res) => res.json())
    console.log(data)

    return {
        props: {
            users: data,
        },
    }
}
