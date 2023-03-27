'use client'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { UserCircle } from 'tabler-icons-react'
import clsx from 'clsx'
import Image from 'next/image'
import { useState } from 'react'
import RolesDictionary from '@utils/dictionaries/RolesDictionary'

export const UserAuth = () => {
    const [loading, setLoading] = useState(false)
    const { data: session } = useSession()
    if (session?.user) {
        return (
            <>
                <span className="hidden flex-col items-end lg:flex">
                    <span className="text-sm font-semibold">
                        {session.user.email}
                    </span>
                    <span className="text-xs italic">
                        {RolesDictionary[session.user.role]}
                    </span>
                </span>
                <Menu as="div" className="relative ml-1">
                    <div>
                        <Menu.Button className="group flex max-w-xs items-center rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-primary">
                            <span className="sr-only">Open user menu</span>
                            {session.user.image ? (
                                loading ? (
                                    <div className="flex h-10 w-10 items-center justify-center">
                                        <span className="loader h-8 w-8"></span>
                                    </div>
                                ) : (
                                    <Image
                                        src={session.user.image}
                                        className="h-10 w-10 overflow-hidden rounded-full"
                                        alt="Image de usuario"
                                        width={100}
                                        height={100}
                                    />
                                )
                            ) : loading ? (
                                <div className="flex h-10 w-10 items-center justify-center">
                                    <span className="loader h-8 w-8"></span>
                                </div>
                            ) : (
                                <UserCircle className="h-10 w-10 stroke-[1.5px]" />
                            )}
                        </Menu.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right space-y-1 overflow-hidden rounded bg-white py-1 shadow-lg ring-1 ring-gray-300 focus:outline-none">
                            <Menu.Item>
                                {({ active }) => (
                                    <Link
                                        href={'/profile'}
                                        className={clsx(
                                            active ? 'bg-gray-100 ' : '',
                                            'block w-full px-6 py-2 text-left text-sm font-medium text-gray-700'
                                        )}
                                    >
                                        Perfil
                                    </Link>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        className={clsx(
                                            active ? 'bg-gray-100 ' : '',
                                            'block w-full px-6 py-2 text-left text-sm font-medium text-gray-700'
                                        )}
                                        onClick={() => {
                                            setLoading(true)
                                            signOut({ callbackUrl: '/' })
                                        }}
                                    >
                                        Cerrar sesión
                                    </button>
                                )}
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </>
        )
    }

    return <></>
}
