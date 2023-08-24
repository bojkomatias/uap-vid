'use client'
import { Popover, Transition } from '@headlessui/react'

import { buttonStyle } from './button/styles'

export default function PopoverButton({
    children,
    title,
}: {
    children: React.ReactNode
    title: string
}) {
    return (
        <Popover>
            <Popover.Button
                className={` ${buttonStyle(
                    'secondary',
                    false
                )} px-2 py-1 text-xs`}
            >
                {title}
            </Popover.Button>

            <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
            >
                <Popover.Panel className="absolute -top-9 right-0 z-30 rounded-md bg-success-50 px-2 py-2 shadow-md">
                    {children}
                </Popover.Panel>
            </Transition>
        </Popover>
    )
}
