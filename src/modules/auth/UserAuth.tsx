'use client'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { UserCircle } from 'tabler-icons-react'
import clsx from 'clsx'
import { roleTranslate } from '@utils/zod'
import Image from 'next/image'

export const UserAuth = () => {
    const { data: session } = useSession()
    if (session?.user) {
        return (
            <>
                <span className="hidden lg:flex flex-col items-end">
                    <span className="font-semibold text-sm">
                        {session.user.email}
                    </span>
                    <span className="italic text-xs">
                        {roleTranslate[session.user.role]}
                    </span>
                </span>
                <Menu as="div" className="relative ml-1">
                    <div>
                        <Menu.Button className="group flex max-w-xs items-center rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-primary">
                            <span className="sr-only">Open user menu</span>
                            {session.user.image ? (
                                <Image
                                    src={session.user.image}
                                    className="h-10 w-10 rounded-full overflow-hidden"
                                    alt="Image de usuario"
                                    width={100}
                                    height={100}
                                />
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
                        <Menu.Items className="overflow-hidden rounded absolute right-0 z-10 mt-2 w-48 origin-top-right bg-white py-1 shadow-lg ring-1 ring-gray-300 focus:outline-none space-y-1">
                            <Menu.Item>
                                {({ active }) => (
                                    <Link
                                        href={'/profile'}
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
