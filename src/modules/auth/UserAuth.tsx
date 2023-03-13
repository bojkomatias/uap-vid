'use client'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { UserCircle } from 'tabler-icons-react'
import clsx from 'clsx'

export const UserAuth = () => {
    const { data: session } = useSession()

    if (session) {
        return (
            <>
                Bienvenido <b>{session?.user?.email} </b>{' '}
                <Menu as="div" className="relative ml-1">
                    <div>
                        <Menu.Button className="group flex max-w-xs items-center rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-primary">
                            <span className="sr-only">Open user menu</span>
                            <UserCircle className="h-8 w-8 stroke-[1.5px]" />
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
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none space-y-1">
                            <Menu.Item>
                                {({ active }) => (
                                    <Link
                                        href="protected/profile"
                                        className={clsx(
                                            active ? 'bg-gray-100 ' : '',
                                            'block px-6 py-2 text-sm text-gray-700 w-full text-left font-medium'
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
                                            'block px-6 py-2 text-sm text-gray-700 w-full text-left font-medium'
                                        )}
                                        onClick={() =>
                                            signOut({ callbackUrl: '/' })
                                        }
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
