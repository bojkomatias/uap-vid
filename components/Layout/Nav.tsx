/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { navigation } from '../../config/navigation'
import { Button } from '../Atomic/Button'
import Image from 'next/image'

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export default function Example() {
    return (
        <Popover className="relative bg-primary-700">
            <div
                className="pointer-events-none absolute inset-0 z-30 shadow"
                aria-hidden="true"
            />
            <div className="relative z-20">
                <div className="mx-auto flex max-w-7xl items-center justify-between  px-4 py-5 sm:px-6 sm:py-4 md:justify-start md:space-x-10 lg:px-8 ">
                    <div>
                        <a href="#" className="flex">
                            <span className="sr-only">Workflow</span>
                            <div className="flex h-12 w-32 items-center p-1">
                                <Image
                                    src="/logo.png"
                                    alt=""
                                    width={400}
                                    height={60}
                                />
                            </div>
                        </a>
                    </div>
                    <div className="-my-2 -mr-2 md:hidden">
                        <Popover.Button className="text-gray-400 hover:bg-gray-100 hover:text-gray-500 inline-flex items-center justify-center rounded bg-base-100 p-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                            <span className="sr-only">Open menu</span>
                            <MenuIcon className="h-6 w-6" aria-hidden="true" />
                        </Popover.Button>
                    </div>
                    <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
                        <Popover.Group as="nav" className="flex space-x-10">
                            <Popover>
                                {({ open }) => (
                                    <>
                                        <Popover.Button
                                            className={classNames(
                                                open
                                                    ? 'text-gray-900'
                                                    : 'text-gray-500',
                                                'hover:text-gray-900 group inline-flex items-center rounded bg-base-100 text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-4'
                                            )}
                                        >
                                            <span>Solutions</span>
                                            <ChevronDownIcon
                                                className={classNames(
                                                    open
                                                        ? 'text-gray-600'
                                                        : 'text-gray-400',
                                                    'group-hover:text-gray-500 ml-2 h-5 w-5'
                                                )}
                                                aria-hidden="true"
                                            />
                                        </Popover.Button>
                                    </>
                                )}
                            </Popover>
                            <a
                                href="/about"
                                className="text-gray-500 hover:text-gray-900 text-base font-medium"
                            >
                                About Us
                            </a>
                            <a
                                href="/contact"
                                className="text-gray-500 hover:text-gray-900 text-base font-medium"
                            >
                                Contact
                            </a>
                            <Popover>
                                {({ open }) => (
                                    <>
                                        <Popover.Button
                                            className={classNames(
                                                open
                                                    ? 'text-gray-900'
                                                    : 'text-gray-500',
                                                'hover:text-gray-900 group inline-flex items-center rounded bg-base-100 text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
                                            )}
                                        >
                                            <span>More</span>
                                            <ChevronDownIcon
                                                className={classNames(
                                                    open
                                                        ? 'text-gray-600'
                                                        : 'text-gray-400',
                                                    'group-hover:text-gray-500 ml-2 h-5 w-5'
                                                )}
                                                aria-hidden="true"
                                            />
                                        </Popover.Button>
                                    </>
                                )}
                            </Popover>
                        </Popover.Group>
                        <div className="flex items-center md:ml-12">
                            <Button onClick={() => console.log('Loggin in!')}>
                                Log in
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <Transition
                as={Fragment}
                enter="duration-200 ease-out"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="duration-100 ease-in"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <Popover.Panel
                    focus
                    className="absolute inset-x-0 top-0 z-30 origin-top-right transform p-2 transition md:hidden"
                >
                    <div className="rounded-lg border bg-primary-600 shadow-xl">
                        <div className="px-5 pt-5 pb-6 sm:pb-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Image
                                        src="/logo.png"
                                        alt=""
                                        width={200}
                                        height={30}
                                    />
                                </div>
                                <div className="-mr-2">
                                    <Popover.Button className="text-gray-400 hover:bg-gray-100 hover:text-gray-500 inline-flex items-center justify-center rounded bg-base-100 p-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                                        <span className="sr-only">
                                            Close menu
                                        </span>
                                        <XIcon
                                            className="h-6 w-6"
                                            aria-hidden="true"
                                        />
                                    </Popover.Button>
                                </div>
                            </div>
                            <div className="mt-6 sm:mt-8">
                                <nav>
                                    <div className="mt-8 text-base">
                                        <a
                                            href="#"
                                            className="font-medium text-primary-600 hover:text-primary-500"
                                        >
                                            {' '}
                                            View all products{' '}
                                            <span aria-hidden="true">
                                                &rarr;
                                            </span>
                                        </a>
                                    </div>
                                </nav>
                            </div>
                        </div>
                        <div className="py-6 px-5">
                            <div className="grid grid-cols-2 gap-4">
                                <a
                                    href="#"
                                    className="text-gray-900 hover:text-gray-700 rounded text-base font-medium"
                                >
                                    Pricing
                                </a>

                                <a
                                    href="#"
                                    className="text-gray-900 hover:text-gray-700 rounded text-base font-medium"
                                >
                                    Docs
                                </a>

                                <a
                                    href="#"
                                    className="text-gray-900 hover:text-gray-700 rounded text-base font-medium"
                                >
                                    Company
                                </a>

                                <a
                                    href="#"
                                    className="text-gray-900 hover:text-gray-700 rounded text-base font-medium"
                                >
                                    Resources
                                </a>

                                <a
                                    href="#"
                                    className="text-gray-900 hover:text-gray-700 rounded text-base font-medium"
                                >
                                    Blog
                                </a>

                                <a
                                    href="#"
                                    className="text-gray-900 hover:text-gray-700 rounded text-base font-medium"
                                >
                                    Contact Sales
                                </a>
                            </div>
                            <div className="mt-6">
                                <a
                                    href="#"
                                    className="bg-primary hover:bg-primary border-transparent text-white flex w-full items-center justify-center rounded border px-4 py-2 text-base font-medium shadow-sm"
                                >
                                    Sign up
                                </a>
                                <p className="text-gray-500 mt-6 text-center text-base font-medium">
                                    Existing customer?{' '}
                                    <a
                                        href="#"
                                        className="text-primary-600 hover:text-primary-500"
                                    >
                                        Sign in
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </Popover.Panel>
            </Transition>
        </Popover>
    )
}
