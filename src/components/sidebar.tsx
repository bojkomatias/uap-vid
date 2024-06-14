'use client'

import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import { LayoutGroup, motion } from 'framer-motion'
import React, { Fragment, useId } from 'react'
import { TouchTarget } from './button'
import { Link } from './link'

export function Sidebar({
    className,
    ...props
}: React.ComponentPropsWithoutRef<'nav'>) {
    return (
        <nav {...props} className={clsx(className, 'flex h-full flex-col')} />
    )
}

export function SidebarHeader({
    className,
    ...props
}: React.ComponentPropsWithoutRef<'div'>) {
    return (
        <div
            {...props}
            className={clsx(
                className,
                'flex flex-col border-b border-gray-950/5 p-4 dark:border-white/5 [&>[data-slot=section]+[data-slot=section]]:mt-2.5'
            )}
        />
    )
}

export function SidebarBody({
    className,
    ...props
}: React.ComponentPropsWithoutRef<'div'>) {
    return (
        <div
            {...props}
            className={clsx(
                className,
                'flex flex-1 flex-col overflow-y-auto p-4 [&>[data-slot=section]+[data-slot=section]]:mt-8'
            )}
        />
    )
}

export function SidebarFooter({
    className,
    ...props
}: React.ComponentPropsWithoutRef<'div'>) {
    return (
        <div
            {...props}
            className={clsx(
                className,
                'flex flex-col border-t border-gray-950/5 p-4 dark:border-white/5 [&>[data-slot=section]+[data-slot=section]]:mt-2.5'
            )}
        />
    )
}

export function SidebarSection({
    className,
    ...props
}: React.ComponentPropsWithoutRef<'div'>) {
    const id = useId()

    return (
        <LayoutGroup id={id}>
            <div
                {...props}
                data-slot="section"
                className={clsx(className, 'flex flex-col gap-0.5')}
            />
        </LayoutGroup>
    )
}

export function SidebarDivider({
    className,
    ...props
}: React.ComponentPropsWithoutRef<'hr'>) {
    return (
        <hr
            {...props}
            className={clsx(
                className,
                'my-4 border-t border-gray-950/5 dark:border-white/5 lg:-mx-4'
            )}
        />
    )
}

export function SidebarSpacer({
    className,
    ...props
}: React.ComponentPropsWithoutRef<'div'>) {
    return (
        <div
            aria-hidden="true"
            {...props}
            className={clsx(className, 'mt-8 flex-1')}
        />
    )
}

export function SidebarHeading({
    className,
    ...props
}: React.ComponentPropsWithoutRef<'h3'>) {
    return (
        <h3
            {...props}
            className={clsx(
                className,
                'mb-1 px-2 text-xs/6 font-medium text-gray-500 dark:text-gray-400'
            )}
        />
    )
}

export const SidebarItem = React.forwardRef(function SidebarItem(
    {
        current,
        className,
        children,
        ...props
    }: { current?: boolean; className?: string; children: React.ReactNode } & (
        | Omit<Headless.ButtonProps, 'className'>
        | Omit<
              React.ComponentPropsWithoutRef<typeof Link>,
              'type' | 'className'
          >
    ),
    ref: React.ForwardedRef<HTMLAnchorElement | HTMLButtonElement>
) {
    const classes = clsx(
        // Base
        'flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-base/6 font-medium text-gray-950 sm:py-2 sm:text-sm/5',
        // Leading icon/icon-only
        'data-[slot=icon]:*:size-6 data-[slot=icon]:*:shrink-0 data-[slot=icon]:*:stroke-gray-500 sm:data-[slot=icon]:*:size-5',
        // Trailing icon (down chevron or similar)
        'data-[slot=icon]:last:*:ml-auto data-[slot=icon]:last:*:size-5 sm:data-[slot=icon]:last:*:size-4',
        // Avatar
        'data-[slot=avatar]:*:-m-0.5 data-[slot=avatar]:*:size-7 data-[slot=avatar]:*:[--ring-opacity:10%] sm:data-[slot=avatar]:*:size-6',
        // Hover
        'data-[hover]:bg-gray-950/5 data-[slot=icon]:*:data-[hover]:stroke-gray-950',
        // Active
        'data-[active]:bg-gray-950/5 data-[slot=icon]:*:data-[active]:stroke-gray-950',
        // Current
        'data-[slot=icon]:*:data-[current]:stroke-gray-950',
        // Dark mode
        'dark:text-white dark:data-[slot=icon]:*:stroke-gray-400',
        'dark:data-[hover]:bg-white/5 dark:data-[slot=icon]:*:data-[hover]:stroke-white',
        'dark:data-[active]:bg-white/5 dark:data-[slot=icon]:*:data-[active]:stroke-white',
        'dark:data-[slot=icon]:*:data-[current]:stroke-white'
    )

    return (
        <span className={clsx(className, 'relative')}>
            {current && (
                <motion.span
                    layoutId="current-indicator"
                    className="absolute inset-y-2 -left-4 w-0.5 rounded-full bg-gray-950 dark:bg-white"
                />
            )}
            {'href' in props ? (
                <Headless.CloseButton as={Fragment} ref={ref}>
                    <Link
                        className={classes}
                        {...props}
                        data-current={current ? 'true' : undefined}
                    >
                        <TouchTarget>{children}</TouchTarget>
                    </Link>
                </Headless.CloseButton>
            ) : (
                <Headless.Button
                    {...props}
                    className={clsx('cursor-default', classes)}
                    data-current={current ? 'true' : undefined}
                    ref={ref}
                >
                    <TouchTarget>{children}</TouchTarget>
                </Headless.Button>
            )}
        </span>
    )
})

export function SidebarLabel({
    className,
    ...props
}: React.ComponentPropsWithoutRef<'span'>) {
    return <span {...props} className={clsx(className, 'truncate')} />
}
