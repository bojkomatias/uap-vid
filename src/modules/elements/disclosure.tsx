'use client'
/* eslint-disable react/no-unescaped-entities */
import { Disclosure, Transition } from '@headlessui/react'
import React from 'react'
import { ChevronUp } from 'tabler-icons-react'

export default function DisclosureComponent({
    title,
    children,
}: {
    title: React.ReactNode
    children: React.ReactNode
}) {
    return (
        <div className="w-full">
            <div className="mx-auto w-full max-w-md  rounded-md  bg-white ">
                <Disclosure>
                    {({ open }) => (
                        <>
                            <Disclosure.Button className="bg-purple-100 text-purple-900 focus-visible:ring-purple-500 flex w-full justify-between rounded-lg px-4 py-3 text-left text-sm font-medium transition hover:bg-primary-100 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75">
                                <span>{title}</span>
                                <ChevronUp
                                    className={`${
                                        open ? 'rotate-180 transform' : ''
                                    } text-purple-500 h-5 w-5`}
                                />
                            </Disclosure.Button>
                            <Transition
                                enter="transition-opacity duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition-opacity duration-150"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Disclosure.Panel className="px-4 pb-4 pt-3  text-sm text-gray-500">
                                    {children}
                                </Disclosure.Panel>
                            </Transition>
                        </>
                    )}
                </Disclosure>
            </div>
        </div>
    )
}
