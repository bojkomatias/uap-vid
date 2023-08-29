'use client'
import { Popover, Transition } from '@headlessui/react'

import { buttonStyle } from './button/styles'
import React from 'react'

export default function PopoverComponent({
    children,
    title,
    className,
    actionButton,
    column,
}: {
    children: React.ReactNode
    title: string | React.ReactNode
    className?: string
    actionButton: React.ReactNode
    column?: boolean
}) {
    return (
        <Popover>
            <>
                <Popover.Button
                    className={
                        typeof title == 'string'
                            ? ` ${buttonStyle(
                                  'secondary',
                                  false
                              )} px-2 py-1 text-xs`
                            : ''
                    }
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
                    <Popover.Panel
                        className={`${
                            !className
                                ? 'absolute -top-9 right-0 z-30 rounded-md bg-success-50 px-2 py-2 shadow-md'
                                : className
                        }`}
                    >
                        {({ close }) => (
                            <div
                                className={`${
                                    column
                                        ? 'flex flex-col items-end justify-start gap-2'
                                        : 'flex items-center gap-2'
                                }`}
                            >
                                {children}
                                <div
                                    onClick={async () => {
                                        setTimeout(() => {
                                            close()
                                        }, 800)
                                    }}
                                >
                                    {actionButton}
                                </div>
                            </div>
                        )}
                    </Popover.Panel>
                </Transition>
            </>
        </Popover>
    )
}
