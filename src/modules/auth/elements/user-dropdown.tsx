'use client'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Logout, Settings } from 'tabler-icons-react'
import { cx } from '@utils/cx'
import Image from 'next/image'
import { useState } from 'react'
import RolesDictionary from '@utils/dictionaries/RolesDictionary'
import { usePathname } from 'next/navigation'

export const UserDropdown = () => {
    const [loading, setLoading] = useState(false)
    const { data: session } = useSession()

    const path = usePathname()
    if (session?.user) {
        return (
            <>
                <span className="hidden flex-col items-end lg:flex">
                    <span className="text-xs font-medium">
                        {session.user.name}
                    </span>
                </span>
                <Menu as="div" className="relative ml-1">
                    <div>
                        <Menu.Button
                            disabled={loading}
                            className="group flex max-w-xs items-center rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 focus:ring-offset-primary"
                        >
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
                                // <UserCircle className="h-10 w-10 stroke-[1.5px]" />
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/30 font-semibold">
                                    {session.user.name
                                        .split(' ')[0]
                                        .substring(0, 1) +
                                        session.user.name
                                            .split(' ')
                                            .at(-1)
                                            ?.substring(0, 1)}
                                </div>
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
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="px-4 py-3">
                                <p className="ml-2 mt-1 text-[0.8rem] font-semibold leading-4 text-gray-800">
                                    {RolesDictionary[session.user.role]}
                                </p>
                                <p className="ml-2 truncate text-xs font-medium leading-loose text-gray-700">
                                    {session.user.email}
                                </p>
                            </div>
                            <div className="py-1">
                                <Menu.Item>
                                    {({ active }) => (
                                        <Link
                                            href={'/profile'}
                                            className={cx(
                                                'block w-full px-6 py-2 text-left text-sm font-medium text-gray-700',
                                                active && 'bg-gray-100',
                                                path == '/profile' &&
                                                    'pointer-events-none bg-gray-100 font-bold'
                                            )}
                                            passHref
                                        >
                                            <Settings className="-mt-0.5 mr-2 inline h-5 w-4" />
                                            Cuenta
                                        </Link>
                                    )}
                                </Menu.Item>
                            </div>
                            <div className="py-1">
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={cx(
                                                'block w-full px-6 py-2 text-left text-sm font-semibold text-gray-700',
                                                active && 'bg-gray-100'
                                            )}
                                            onClick={() => {
                                                setLoading(true)
                                                signOut({ callbackUrl: '/' })
                                            }}
                                        >
                                            <Logout className="-mt-0.5 mr-2 inline h-5 w-4" />
                                            Cerrar sesión
                                        </button>
                                    )}
                                </Menu.Item>
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </>
        )
    }

    return <></>
}