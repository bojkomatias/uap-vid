'use client'
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, Menu2 } from 'tabler-icons-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@elements/Button'
import clsx from 'clsx'
import { canAccess } from '@utils/scopes'
import { user } from '@prisma/client'
import { navigation } from './navigation'

export default function MobileNavigation({ user }: { user: user }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const pathname = usePathname()
    return (
        <>
            <div className="sticky -mt-10 -ml-12  z-10 sm:pl-3 sm:pt-3 lg:hidden">
                <Button intent="secondary" onClick={() => setSidebarOpen(true)}>
                    <span className="sr-only">Open sidebar</span>
                    <Menu2 className="h-5 " aria-hidden="true" />
                </Button>
            </div>
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
                                    <div className="absolute top-0 right-0 -mr-12 pt-2">
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
                                <div className="flex-1 overflow-y-auto pt-5 pb-4">
                                    <nav className="mt-10 space-y-3 px-2">
                                        {navigation.map((item) =>
                                            canAccess(item.scope, user.role) ? (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className={clsx(
                                                        pathname === item.href
                                                            ? 'bg-primary text-white'
                                                            : 'text-base-700 hover:bg-base-100 hover:text-black',
                                                        'group flex items-center px-4 py-3 text-sm font-medium rounded'
                                                    )}
                                                    passHref
                                                >
                                                    <item.icon
                                                        className={clsx(
                                                            pathname ===
                                                                item.href
                                                                ? 'text-base-100'
                                                                : 'text-base-700 group-hover:text-black',
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
