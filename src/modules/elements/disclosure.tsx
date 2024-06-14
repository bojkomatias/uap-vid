'use client'
/* eslint-disable react/no-unescaped-entities */
import { Disclosure, Transition } from '@headlessui/react'
import React from 'react'
import { ChevronUp } from 'tabler-icons-react'
import { Button } from './button'

export default function DisclosureComponent({
    title,
    children,
}: {
    title: React.ReactNode
    children: React.ReactNode
}) {
    return (
        <div className="w-full">
            <div className="mx-auto w-full rounded-md bg-white ">
                <Disclosure>
                    {({ open }) => (
                        <>
                            <Disclosure.Button
                                as={Button}
                                intent="secondary"
                                size="md"
                                className="w-full justify-between"
                            >
                                <span>{title}</span>
                                <ChevronUp
                                    className={`${
                                        open ? 'rotate-180 transform' : ''
                                    } h-4 w-4 text-purple-500`}
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
