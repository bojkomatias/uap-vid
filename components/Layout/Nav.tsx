/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { navigation } from '../../config/navigation'
import { Button } from '../Atomic/Button'

const { solutions, callsToAction, company, resources, blogPosts } = navigation

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export default function Example() {
    return (
        <Popover className="relative bg-base-100">
            <div
                className="pointer-events-none absolute inset-0 z-30 shadow"
                aria-hidden="true"
            />
            <div className="relative z-20">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 sm:py-4 md:justify-start md:space-x-10 lg:px-8">
                    <div>
                        <a href="#" className="flex">
                            <span className="sr-only">Workflow</span>
                            <div className="font-mono text-2xl font-black text-primary-700">
                                LOGO
                            </div>
                        </a>
                    </div>
                    <div className="-my-2 -mr-2 md:hidden">
                        <Popover.Button className="rounded text-gray-400 hover:bg-gray-100 hover:text-gray-500 inline-flex items-center justify-center bg-base-100 p-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
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
                                                'rounded hover:text-gray-900 group inline-flex items-center bg-base-100 text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-4'
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

                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-200"
                                            enterFrom="opacity-0 -translate-y-1"
                                            enterTo="opacity-100 translate-y-0"
                                            leave="transition ease-in duration-150"
                                            leaveFrom="opacity-100 translate-y-0"
                                            leaveTo="opacity-0 -translate-y-1"
                                        >
                                            <Popover.Panel className="absolute inset-x-0 top-full z-10 hidden transform bg-base-100 shadow-lg md:block">
                                                <div className="mx-auto grid max-w-7xl gap-y-6 px-4 py-6 sm:grid-cols-2 sm:gap-8 sm:px-6 sm:py-8 lg:grid-cols-4 lg:px-8 lg:py-12 xl:py-16">
                                                    {solutions.map(
                                                        (item: any) => (
                                                            <a
                                                                key={item.name}
                                                                href={item.href}
                                                                className="rounded hover:bg-gray-50 -m-3 flex flex-col justify-between p-3"
                                                            >
                                                                <div className="flex md:h-full lg:flex-col">
                                                                    <div className="flex-shrink-0">
                                                                        <span className="rounded text-white inline-flex h-10 w-10 items-center justify-center bg-primary-600 sm:h-12 sm:w-12">
                                                                            <item.icon
                                                                                className="h-6 w-6"
                                                                                aria-hidden="true"
                                                                            />
                                                                        </span>
                                                                    </div>
                                                                    <div className="ml-4 md:flex md:flex-1 md:flex-col md:justify-between lg:ml-0 lg:mt-4">
                                                                        <div>
                                                                            <p className="text-gray-900 text-base font-medium">
                                                                                {
                                                                                    item.name
                                                                                }
                                                                            </p>
                                                                            <p className="text-gray-500 mt-1 text-sm">
                                                                                {
                                                                                    item.description
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                        <p className="mt-2 text-sm font-medium text-primary-600 lg:mt-4">
                                                                            Learn
                                                                            more{' '}
                                                                            <span aria-hidden="true">
                                                                                &rarr;
                                                                            </span>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </a>
                                                        )
                                                    )}
                                                </div>
                                                <div className="bg-gray-50">
                                                    <div className="mx-auto max-w-7xl space-y-6 px-4 py-5 sm:flex sm:space-y-0 sm:space-x-10 sm:px-6 lg:px-8">
                                                        {callsToAction.map(
                                                            (item: any) => (
                                                                <div
                                                                    key={
                                                                        item.name
                                                                    }
                                                                    className="flow-root"
                                                                >
                                                                    <a
                                                                        href={
                                                                            item.href
                                                                        }
                                                                        className="rounded text-gray-900 hover:bg-gray-100 -m-3 flex items-center p-3 text-base font-medium"
                                                                    >
                                                                        <item.icon
                                                                            className="text-gray-400 h-6 w-6 flex-shrink-0"
                                                                            aria-hidden="true"
                                                                        />
                                                                        <span className="ml-3">
                                                                            {
                                                                                item.name
                                                                            }
                                                                        </span>
                                                                    </a>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </Popover.Panel>
                                        </Transition>
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
                                                'rounded hover:text-gray-900 group inline-flex items-center bg-base-100 text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
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

                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-200"
                                            enterFrom="opacity-0 -translate-y-1"
                                            enterTo="opacity-100 translate-y-0"
                                            leave="transition ease-in duration-150"
                                            leaveFrom="opacity-100 translate-y-0"
                                            leaveTo="opacity-0 -translate-y-1"
                                        >
                                            <Popover.Panel className="absolute inset-x-0 top-full z-10 hidden transform shadow-lg md:block">
                                                <div className="absolute inset-0 flex">
                                                    <div className="w-1/2 bg-base-100" />
                                                    <div className="bg-gray-50 w-1/2" />
                                                </div>
                                                <div className="relative mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
                                                    <nav className="grid gap-y-10 bg-base-100 px-4 py-8 sm:grid-cols-2 sm:gap-x-8 sm:py-12 sm:px-6 lg:px-8 xl:pr-12">
                                                        <div>
                                                            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                                                                Company
                                                            </h3>
                                                            <ul
                                                                role="list"
                                                                className="mt-5 space-y-6"
                                                            >
                                                                {company.map(
                                                                    (
                                                                        item: any
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                item.name
                                                                            }
                                                                            className="flow-root"
                                                                        >
                                                                            <a
                                                                                href={
                                                                                    item.href
                                                                                }
                                                                                className="rounded text-gray-900 hover:bg-gray-50 -m-3 flex items-center p-3 text-base font-medium"
                                                                            >
                                                                                <item.icon
                                                                                    className="text-gray-400 h-6 w-6 flex-shrink-0"
                                                                                    aria-hidden="true"
                                                                                />
                                                                                <span className="ml-4">
                                                                                    {
                                                                                        item.name
                                                                                    }
                                                                                </span>
                                                                            </a>
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                                                                Resources
                                                            </h3>
                                                            <ul
                                                                role="list"
                                                                className="mt-5 space-y-6"
                                                            >
                                                                {resources.map(
                                                                    (
                                                                        item: any
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                item.name
                                                                            }
                                                                            className="flow-root"
                                                                        >
                                                                            <a
                                                                                href={
                                                                                    item.href
                                                                                }
                                                                                className="rounded text-gray-900 hover:bg-gray-50 -m-3 flex items-center p-3 text-base font-medium"
                                                                            >
                                                                                <item.icon
                                                                                    className="text-gray-400 h-6 w-6 flex-shrink-0"
                                                                                    aria-hidden="true"
                                                                                />
                                                                                <span className="ml-4">
                                                                                    {
                                                                                        item.name
                                                                                    }
                                                                                </span>
                                                                            </a>
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        </div>
                                                    </nav>
                                                    <div className="bg-gray-50 px-4 py-8 sm:py-12 sm:px-6 lg:px-8 xl:pl-12">
                                                        <div>
                                                            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                                                                From the blog
                                                            </h3>
                                                            <ul
                                                                role="list"
                                                                className="mt-6 space-y-6"
                                                            >
                                                                {blogPosts.map(
                                                                    (post) => (
                                                                        <li
                                                                            key={
                                                                                post.id
                                                                            }
                                                                            className="flow-root"
                                                                        >
                                                                            <a
                                                                                href={
                                                                                    post.href
                                                                                }
                                                                                className="rounded hover:bg-gray-100 -m-3 flex p-3"
                                                                            >
                                                                                <div className="hidden flex-shrink-0 sm:block">
                                                                                    <img
                                                                                        className="rounded h-20 w-32 object-cover"
                                                                                        src={
                                                                                            post.imageUrl
                                                                                        }
                                                                                        alt=""
                                                                                    />
                                                                                </div>
                                                                                <div className="w-0 flex-1 sm:ml-8">
                                                                                    <h4 className="text-gray-900 truncate text-base font-medium">
                                                                                        {
                                                                                            post.name
                                                                                        }
                                                                                    </h4>
                                                                                    <p className="text-gray-500 mt-1 text-sm">
                                                                                        {
                                                                                            post.preview
                                                                                        }
                                                                                    </p>
                                                                                </div>
                                                                            </a>
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        </div>
                                                        <div className="mt-6 text-sm font-medium">
                                                            <a
                                                                href="#"
                                                                className="text-primary-600 hover:text-primary-500"
                                                            >
                                                                {' '}
                                                                View all posts{' '}
                                                                <span aria-hidden="true">
                                                                    &rarr;
                                                                </span>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Popover.Panel>
                                        </Transition>
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
                    <div className="divide-gray-50 rounded ring-black divide-y-2 bg-base-100 shadow-lg ring-1 ring-opacity-5">
                        <div className="px-5 pt-5 pb-6 sm:pb-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <img
                                        className="h-8 w-auto"
                                        src="https://tailwindui.com/img/logos/workflow-mark-primary-600.svg"
                                        alt="Workflow"
                                    />
                                </div>
                                <div className="-mr-2">
                                    <Popover.Button className="rounded text-gray-400 hover:bg-gray-100 hover:text-gray-500 inline-flex items-center justify-center bg-base-100 p-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
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
                                    <div className="grid gap-7 sm:grid-cols-2 sm:gap-y-8 sm:gap-x-4">
                                        {solutions.map((item: any) => (
                                            <a
                                                key={item.name}
                                                href={item.href}
                                                className="rounded hover:bg-gray-50 -m-3 flex items-center p-3"
                                            >
                                                <div className="bg-primary rounded text-white flex h-10 w-10 flex-shrink-0 items-center justify-center sm:h-12 sm:w-12">
                                                    <item.icon
                                                        className="h-6 w-6"
                                                        aria-hidden="true"
                                                    />
                                                </div>
                                                <div className="text-gray-900 ml-4 text-base font-medium">
                                                    {item.name}
                                                </div>
                                            </a>
                                        ))}
                                    </div>
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
                                    className="rounded text-gray-900 hover:text-gray-700 text-base font-medium"
                                >
                                    Pricing
                                </a>

                                <a
                                    href="#"
                                    className="rounded text-gray-900 hover:text-gray-700 text-base font-medium"
                                >
                                    Docs
                                </a>

                                <a
                                    href="#"
                                    className="rounded text-gray-900 hover:text-gray-700 text-base font-medium"
                                >
                                    Company
                                </a>

                                <a
                                    href="#"
                                    className="rounded text-gray-900 hover:text-gray-700 text-base font-medium"
                                >
                                    Resources
                                </a>

                                <a
                                    href="#"
                                    className="rounded text-gray-900 hover:text-gray-700 text-base font-medium"
                                >
                                    Blog
                                </a>

                                <a
                                    href="#"
                                    className="rounded text-gray-900 hover:text-gray-700 text-base font-medium"
                                >
                                    Contact Sales
                                </a>
                            </div>
                            <div className="mt-6">
                                <a
                                    href="#"
                                    className="bg-primary hover:bg-primary rounded border-transparent text-white flex w-full items-center justify-center border px-4 py-2 text-base font-medium shadow-sm"
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
