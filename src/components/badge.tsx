import * as Headless from '@headlessui/react'
import React from 'react'
import { TouchTarget } from './button'
import { Link } from './link'
import { cx } from '@utils/cx'

const colors = {
  light:
    'bg-black/5 text-gray-700 group-data-[hover]:bg-black/10 dark:bg-white/5 dark:text-gray-200 dark:group-data-[hover]:bg-black/10',
  red: 'bg-red-500/15 text-red-700 group-data-[hover]:bg-red-500/25 dark:bg-red-500/10 dark:text-red-400 dark:group-data-[hover]:bg-red-500/20',
  orange:
    'bg-orange-500/15 text-orange-700 group-data-[hover]:bg-orange-500/25 dark:bg-orange-500/10 dark:text-orange-400 dark:group-data-[hover]:bg-orange-500/20',
  amber:
    'bg-amber-400/20 text-amber-700 group-data-[hover]:bg-amber-400/30 dark:bg-amber-400/10 dark:text-amber-400 dark:group-data-[hover]:bg-amber-400/15',
  yellow:
    'bg-yellow-400/20 text-yellow-700 group-data-[hover]:bg-yellow-400/30 dark:bg-yellow-400/10 dark:text-yellow-300 dark:group-data-[hover]:bg-yellow-400/15',
  lime: 'bg-lime-400/20 text-lime-700 group-data-[hover]:bg-lime-400/30 dark:bg-lime-400/10 dark:text-lime-300 dark:group-data-[hover]:bg-lime-400/15',
  green:
    'bg-green-500/15 text-green-700 group-data-[hover]:bg-green-500/25 dark:bg-green-500/10 dark:text-green-400 dark:group-data-[hover]:bg-green-500/20',
  emerald:
    'bg-emerald-500/15 text-emerald-700 group-data-[hover]:bg-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400 dark:group-data-[hover]:bg-emerald-500/20',
  teal: 'bg-teal-500/15 text-teal-700 group-data-[hover]:bg-teal-500/25 dark:bg-teal-500/10 dark:text-teal-300 dark:group-data-[hover]:bg-teal-500/20',
  cyan: 'bg-cyan-400/20 text-cyan-700 group-data-[hover]:bg-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-300 dark:group-data-[hover]:bg-cyan-400/15',
  sky: 'bg-sky-500/15 text-sky-700 group-data-[hover]:bg-sky-500/25 dark:bg-sky-500/10 dark:text-sky-300 dark:group-data-[hover]:bg-sky-500/20',
  blue: 'bg-blue-500/15 text-blue-700 group-data-[hover]:bg-blue-500/25 dark:text-blue-400 dark:group-data-[hover]:bg-blue-500/25',
  indigo:
    'bg-indigo-500/15 text-indigo-700 group-data-[hover]:bg-indigo-500/25 dark:text-indigo-400 dark:group-data-[hover]:bg-indigo-500/20',
  violet:
    'bg-violet-500/15 text-violet-700 group-data-[hover]:bg-violet-500/25 dark:text-violet-400 dark:group-data-[hover]:bg-violet-500/20',
  purple:
    'bg-purple-500/15 text-purple-700 group-data-[hover]:bg-purple-500/25 dark:text-purple-400 dark:group-data-[hover]:bg-purple-500/20',
  fuchsia:
    'bg-fuchsia-400/15 text-fuchsia-700 group-data-[hover]:bg-fuchsia-400/25 dark:bg-fuchsia-400/10 dark:text-fuchsia-400 dark:group-data-[hover]:bg-fuchsia-400/20',
  pink: 'bg-pink-400/15 text-pink-700 group-data-[hover]:bg-pink-400/25 dark:bg-pink-400/10 dark:text-pink-400 dark:group-data-[hover]:bg-pink-400/20',
  rose: 'bg-rose-400/15 text-rose-700 group-data-[hover]:bg-rose-400/25 dark:bg-rose-400/10 dark:text-rose-400 dark:group-data-[hover]:bg-rose-400/20',
  gray: 'bg-gray-600/10 text-gray-700 group-data-[hover]:bg-gray-600/20 dark:bg-white/5 dark:text-gray-400 dark:group-data-[hover]:bg-white/10',
}

const dotColors = {
  light: {
    badge:
      'bg-gray-500/[0.05] dark:bg-white/5 group-data-[hover]:bg-gray-500/5 text-gray-600 dark:text-gray-200 ring ring-1 ring-inset ring-gray-500/40',
    dot: 'bg-gray-500/50 group-data-[hover]:ring-gray-500/80',
  },
  red: {
    badge:
      'bg-red-500/5 group-data-[hover]:bg-red-500/10 text-gray-600 dark:text-gray-200 ring ring-1 ring-inset ring-red-500/50 group-data-[hover]:ring-red-500/80',
    dot: 'bg-red-500/70 group-data-[hover]:bg-red-500',
  },
  orange: {
    badge:
      'bg-orange-500/5 group-data-[hover]:bg-orange-500/10 text-gray-600 dark:text-gray-200 ring ring-1 ring-inset ring-orange-500/50 group-data-[hover]:ring-orange-500/80',
    dot: 'bg-orange-500/70 group-data-[hover]:bg-orange-500',
  },
  amber: {
    badge:
      'bg-amber-500/5 group-data-[hover]:bg-amber-500/10 text-gray-600 dark:text-gray-200 ring ring-1 ring-inset ring-amber-500/50 group-data-[hover]:ring-amber-500/80',
    dot: 'bg-amber-500/70 group-data-[hover]:bg-amber-500',
  },
  yellow: {
    badge:
      'bg-yellow-500/5 group-data-[hover]:bg-yellow-500/10 text-gray-600 dark:text-gray-200 ring ring-1 ring-inset ring-yellow-500/50 group-data-[hover]:ring-yellow-500/80',
    dot: 'bg-yellow-500/70 group-data-[hover]:bg-yellow-500',
  },
  lime: {
    badge:
      'bg-lime-500/5 group-data-[hover]:bg-lime-500/10 text-gray-600 dark:text-gray-200 ring ring-1 ring-inset ring-lime-500/50 group-data-[hover]:ring-lime-500/80',
    dot: 'bg-lime-500/70 group-data-[hover]:bg-lime-500',
  },
  green: {
    badge:
      'bg-green-500/5 group-data-[hover]:bg-green-500/10 text-gray-600 dark:text-gray-200 ring ring-1 ring-inset ring-green-500/50 group-data-[hover]:ring-green-500/80',
    dot: 'bg-green-500/70 group-data-[hover]:bg-green-500',
  },
  emerald: {
    badge:
      'bg-emerald-500/5 group-data-[hover]:bg-emerald-500/10 text-gray-600 dark:text-gray-200 ring ring-1 ring-inset ring-emerald-500/50 group-data-[hover]:ring-emerald-500/80',
    dot: 'bg-emerald-500/70 group-data-[hover]:bg-emerald-500',
  },
  teal: {
    badge:
      'bg-teal-500/5 group-data-[hover]:bg-teal-500/10 text-gray-600 dark:text-gray-200 ring ring-1 ring-inset ring-teal-500/50 group-data-[hover]:ring-teal-500/80',
    dot: 'bg-teal-500/70 group-data-[hover]:bg-teal-500',
  },
  cyan: {
    badge:
      'bg-cyan-500/5 group-data-[hover]:bg-cyan-500/10 text-gray-600 dark:text-gray-200 ring ring-1 ring-inset ring-cyan-500/50 group-data-[hover]:ring-cyan-500/80',
    dot: 'bg-cyan-500/70 group-data-[hover]:bg-cyan-500',
  },
  sky: {
    badge:
      'bg-sky-500/5 group-data-[hover]:bg-sky-500/10 text-gray-600 dark:text-gray-200 ring ring-1 ring-inset ring-sky-500/50 group-data-[hover]:ring-sky-500/80',
    dot: 'bg-sky-500/70 group-data-[hover]:bg-sky-500',
  },
  blue: {
    badge:
      'bg-blue-500/5 group-data-[hover]:bg-blue-500/10 text-gray-600 dark:text-gray-200 ring ring-1 ring-inset ring-blue-500/50 group-data-[hover]:ring-blue-500/80',
    dot: 'bg-blue-500/70 group-data-[hover]:bg-blue-500',
  },
  indigo: {
    badge:
      'bg-indigo-500/5 group-data-[hover]:bg-indigo-500/10 text-gray-600 dark:text-gray-200 ring ring-1 ring-inset ring-indigo-500/50 group-data-[hover]:ring-indigo-500/80',
    dot: 'bg-indigo-500/70 group-data-[hover]:bg-indigo-500',
  },
  violet: {
    badge:
      'bg-violet-500/5 group-data-[hover]:bg-violet-500/10 text-gray-600 dark:text-gray-200 ring ring-1 ring-inset ring-violet-500/50 group-data-[hover]:ring-violet-500/80',
    dot: 'bg-violet-500/70 group-data-[hover]:bg-violet-500',
  },
  purple: {
    badge:
      'bg-purple-500/5 group-data-[hover]:bg-purple-500/10 text-gray-600 dark:text-gray-200 ring ring-1 ring-inset ring-purple-500/50 group-data-[hover]:ring-purple-500/80',
    dot: 'bg-purple-500/70 group-data-[hover]:bg-purple-500',
  },
  fuchsia: {
    badge:
      'bg-fuchsia-500/5 group-data-[hover]:bg-fuchsia-500/10 text-gray-600 dark:text-gray-200 ring ring-1 ring-inset ring-fuchsia-500/50 group-data-[hover]:ring-fuchsia-500/80',
    dot: 'bg-fuchsia-500/70 group-data-[hover]:bg-fuchsia-500',
  },
  pink: {
    badge:
      'bg-pink-500/5 group-data-[hover]:bg-pink-500/10 text-gray-600 dark:text-gray-200 ring ring-1 ring-inset ring-pink-500/50 group-data-[hover]:ring-pink-500/80',
    dot: 'bg-pink-500/70 group-data-[hover]:bg-pink-500',
  },
  rose: {
    badge:
      'bg-rose-500/5 group-data-[hover]:bg-rose-500/10 text-gray-600 dark:text-gray-200 ring ring-1 ring-inset ring-rose-500/50 group-data-[hover]:ring-rose-500/80',
    dot: 'bg-rose-500/70 group-data-[hover]:bg-rose-500',
  },
  gray: {
    badge:
      'bg-gray-500/5 group-data-[hover]:bg-gray-500/10 text-gray-600 dark:text-gray-200 ring ring-1 ring-inset ring-gray-500/50 group-data-[hover]:ring-gray-500/80',
    dot: 'bg-gray-500/70 group-data-[hover]:bg-gray-500',
  },
}

type BadgeProps = { color?: keyof typeof colors; dot?: boolean }

export function Badge({
  color = 'gray',
  dot,
  children,
  className,
  ...props
}: BadgeProps & React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      {...props}
      className={cx(
        'inline-flex items-center gap-x-1.5 rounded-md px-1.5 py-0.5 text-sm/5 font-medium sm:text-xs/5 forced-colors:outline',
        dot ? dotColors[color].badge : colors[color],
        className
      )}
    >
      {dot && (
        <div className={cx('-mr-0.5 size-2 rounded', dotColors[color].dot)} />
      )}
      {children}
    </span>
  )
}

export const BadgeButton = React.forwardRef(function BadgeButton(
  {
    color = 'gray',
    dot,
    className,
    children,
    ...props
  }: BadgeProps & { className?: string; children: React.ReactNode } & (
      | Omit<Headless.ButtonProps, 'className'>
      | Omit<React.ComponentPropsWithoutRef<typeof Link>, 'className'>
    ),
  ref: React.ForwardedRef<HTMLElement>
) {
  const classes =
    'group relative inline-flex rounded-md focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-primary-950'

  return 'href' in props ?
      <Link
        {...props}
        className={classes}
        ref={ref as React.ForwardedRef<HTMLAnchorElement>}
      >
        <TouchTarget>
          <Badge color={color} dot={dot} className={className}>
            {children}
          </Badge>
        </TouchTarget>
      </Link>
    : <Headless.Button {...props} className={classes} ref={ref}>
        <TouchTarget>
          <Badge color={color} dot={dot} className={className}>
            {children}
          </Badge>
        </TouchTarget>
      </Headless.Button>
})
