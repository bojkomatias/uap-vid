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
                <div key={user.email}>
                    <pre>{JSON.stringify(user, null, 2)}</pre>
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
                                    <Listbox.Button className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 relative w-full cursor-default rounded-md border bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-1 sm:text-sm">
                                        <span className="block truncate">
                                            {user.role}
                                        </span>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
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
                                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            {roles.map((role) => (
                                                <Listbox.Option
                                                    key={role}
                                                    className={({ active }) =>
                                                        classNames(
                                                            active
                                                                ? 'bg-indigo-600 text-white'
                                                                : 'text-gray-900',
                                                            'relative cursor-default select-none py-2 pl-3 pr-9'
                                                        )
                                                    }
                                                    value={role}
                                                >
                                                    {({ selected, active }) => (
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
                                                                            ? 'text-white'
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
