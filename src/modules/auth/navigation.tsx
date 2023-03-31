'use client'
import { ReactNode } from 'react'
import { Session } from 'next-auth'
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, Menu2 } from 'tabler-icons-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@elements/button'
import { canAccess } from '@utils/scopes'
import { User } from '@prisma/client'
import clsx from 'clsx'
import { redirect } from 'next/navigation'

export default function Navigation({
    session,
    children,
}: {
    session: Session
    children: ReactNode
}) {
    if (!session) redirect('/')
    const hasNavigation =
        session?.user?.role === 'ADMIN' || session?.user?.role === 'SECRETARY'
    return (
        <>
            {hasNavigation ? (
                <div className="absolute inset-0">
                    <MobileNavigation user={session?.user!} />
                    <DesktopNavigation user={session?.user!} />
                </div>
            ) : null}
            <div
                className={clsx(
                    'flex flex-1 flex-col',
                    hasNavigation ? 'lg:pl-64' : ''
                )}
            >
                <main className="relative mx-auto w-full max-w-[100rem] flex-1 px-4 pb-20 sm:px-6 2xl:px-10">
                    {children}
                </main>
            </div>
        </>
    )
}

function MobileNavigation({ user }: { user: User }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const pathname = usePathname()
    return (
        <>
            <Button
                intent="primary"
                onClick={() => setSidebarOpen(true)}
                className="absolute left-4 top-5 z-20 sm:left-6 lg:hidden"
            >
                <span className="sr-only">Open sidebar</span>
                <Menu2 className="h-4 " aria-hidden="true" />
            </Button>
            <Transition.Root show={sidebarOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-40 lg:hidden"
                    onClose={setSidebarOpen}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/50" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-40 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute right-0 top-0 -mr-12 pt-2">
                                        <button
                                            type="button"
                                            className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                            onClick={() =>
                                                setSidebarOpen(false)
                                            }
                                        >
                                            <span className="sr-only">
                                                Close sidebar
                                            </span>
                                            <X
                                                className="h-5 text-white"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>
                                </Transition.Child>
                                <div className="flex-1 overflow-y-auto pb-4 pt-5">
                                    <nav className="mt-10 space-y-3 px-2">
                                        {navigation.map((item) =>
                                            canAccess(item.scope, user.role) ? (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className={clsx(
                                                        {
                                                            'bg-gray-200 ring-2 ring-primary/80 ring-offset-1 hover:ring-offset-2':
                                                                pathname?.includes(
                                                                    item.href
                                                                ),

                                                            'bg-primary text-white':
                                                                pathname ===
                                                                item.href,
                                                        },
                                                        'text-base-700 hover:bg-gray-100 hover:text-black',
                                                        'group flex items-center rounded px-4 py-3 text-sm font-medium'
                                                    )}
                                                    passHref
                                                >
                                                    <item.icon
                                                        className={clsx(
                                                            {
                                                                'stroke-2 text-primary':
                                                                    pathname?.includes(
                                                                        item.href
                                                                    ),
                                                                'text-white':
                                                                    pathname ===
                                                                    item.href,
                                                            },
                                                            'text-base-700 group-hover:text-black',
                                                            'mr-3 h-5 flex-shrink-0'
                                                        )}
                                                        aria-hidden="true"
                                                    />
                                                    {item.name}
                                                </Link>
                                            ) : null
                                        )}
                                    </nav>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                        <div className="w-14 flex-shrink-0">
                            {/* Force sidebar to shrink to fit close icon */}
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    )
}

function DesktopNavigation({ user }: { user: User }) {
    const pathname = usePathname()
    return (
        <div className="hidden lg:sticky lg:inset-0 lg:flex lg:h-full lg:max-h-screen lg:w-64 lg:flex-col">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex min-h-0 flex-1 flex-col border-r bg-base-50">
                <div className="flex flex-1 flex-col overflow-y-auto pb-4 pt-5">
                    <nav className="flex-1 space-y-3 px-1.5">
                        {navigation.map((item) =>
                            canAccess(item.scope, user.role) ? (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={clsx(
                                        {
                                            'bg-primary text-white ':
                                                pathname?.includes(item.href),

                                            'ring-2 ring-primary ':
                                                pathname === item.href,
                                        },
                                        'text-base-700 ring-gray-300 ring-offset-2 hover:bg-gray-200 hover:text-black hover:ring-2 focus:outline-none focus:ring-2',
                                        'group flex items-center rounded px-4 py-3 text-sm font-medium transition'
                                    )}
                                    passHref
                                >
                                    <item.icon
                                        className={clsx(
                                            {
                                                'text-white':
                                                    pathname?.includes(
                                                        item.href
                                                    ),
                                                'stroke-[3px]':
                                                    pathname === item.href,
                                            },
                                            'text-base-700 group-hover:text-black',
                                            'mr-3 h-5 flex-shrink-0'
                                        )}
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </Link>
                            ) : null
                        )}
                    </nav>
                </div>
            </div>
        </div>
    )
}

import {
    ClipboardList,
    List,
    ListDetails,
    ReportSearch,
    Users,
} from 'tabler-icons-react'
import { ACCESS } from '@utils/zod'

export const navigation = [
    {
        name: 'Proyectos de investigación',
        icon: List,
        href: '/protocols',
        scope: ACCESS.PROTOCOLS,
    },
    {
        name: 'Lista base de datos evaluadores',
        icon: ClipboardList,
        href: '#',
        scope: ACCESS.USERS,
    },
    {
        name: 'Seguimiento de proyectos aprobados',
        icon: ListDetails,
        href: '#',
        scope: ACCESS.USERS,
    },
    {
        name: 'Información de publicaciones científicas',
        icon: ReportSearch,
        href: '#',
        scope: ACCESS.USERS,
    },
    {
        name: 'Lista de usuarios',
        icon: Users,
        href: '/users',
        scope: ACCESS.USERS,
    },
]
