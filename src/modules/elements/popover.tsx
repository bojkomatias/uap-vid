'use client'
import { Popover, Transition } from '@headlessui/react'
import { buttonStyle } from './button/styles'
import React from 'react'
import { cx } from '@utils/cx'

/**
 * This popover is meant to be used when clicking over an editable field, but it has been made extensible enough to be used in other cases, such other cases, need to specify some Tailwind classes so that the popover won't appear on top of the field/button that it's being called upon.
 * @param children React component or html element.
 * @param title shown in the button that opens the popover.
 * @param className CSS classes.
 * @param actionButton this is the button that appears inside the popover, this button is necessary to close the popover, but it can also perform any action that the developer wants.
 * @param column is a boolean to put the children of the popover in a column (flex column, if false, flex row).
 * @summary the actual types of these parameters are shown by Typescript.
 */

//The "column" prop only affects the action button + the children. That is to say, the children element will be column 1 and the action button will be column 2. If the prop is set to false, children = row 1, action button = row 2.

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
        </Popover>
    )
}
