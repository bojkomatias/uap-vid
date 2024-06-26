'use client'

import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import { Fragment, useState } from 'react'
import { Check } from 'tabler-icons-react'
import { Input } from './input'

type Option = { value: string; label: string; description?: string }

export function Combobox<TValue, TMultiple extends boolean | undefined>({
  className,
  placeholder,
  autoFocus,
  'aria-label': ariaLabel,
  options,
  ...props
}: {
  className?: string
  placeholder?: React.ReactNode
  autoFocus?: boolean
  'aria-label'?: string
  options: Option[]
} & Headless.ComboboxProps<TValue, TMultiple, typeof Fragment>) {
  const [query, setQuery] = useState('')

  const filteredOptions =
    query === '' ? options : (
      options.filter((option) => {
        return option.label.toLowerCase().includes(query.toLowerCase())
      })
    )

  return (
    <Headless.Combobox {...props} onClose={() => setQuery('')}>
      <div className="relative">
        <Headless.ComboboxInput
          as={Input}
          autoFocus={autoFocus}
          data-slot="control"
          aria-label={ariaLabel}
          displayValue={(option: Option) => option?.label ?? placeholder}
          onChange={(event) => setQuery(event.target.value)}
          className={className}
        />
        <Headless.ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
          <svg
            className="size-5 stroke-gray-500 group-data-[disabled]:stroke-gray-600 dark:stroke-gray-400 sm:size-4 forced-colors:stroke-[CanvasText]"
            viewBox="0 0 16 16"
            aria-hidden="true"
            fill="none"
          >
            <path
              d="M5.75 10.75L8 13L10.25 10.75"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.25 5.25L8 3L5.75 5.25"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Headless.ComboboxButton>
      </div>
      <Headless.Transition
        leave="transition-opacity duration-100 ease-in pointer-events-none"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Headless.ComboboxOptions
          anchor="bottom"
          className={clsx(
            // Anchor positioning
            '[--anchor-offset:-1.625rem] [--anchor-padding:theme(spacing.4)] sm:[--anchor-offset:-1.375rem]',
            // Base styles
            'isolate w-full min-w-[calc(var(--button-width)+1.75rem)] select-none scroll-py-1 rounded-xl p-1',
            // Invisible border that is only visible in `forced-colors` mode for accessibility purposes
            'outline outline-1 outline-transparent focus:outline-none',
            // Handle scrolling when menu won't fit in viewport
            'overflow-y-scroll overscroll-contain',
            // Popover background
            'bg-white/75 backdrop-blur-xl dark:bg-gray-800/75',
            // Shadows
            'shadow-lg ring-1 ring-gray-950/10 dark:ring-inset dark:ring-white/10'
          )}
        >
          {filteredOptions.map((option) => (
            <ComboboxOption key={option.value} value={option.value}>
              <ComboboxLabel>{option.label}</ComboboxLabel>
              {option.description && (
                <ComboboxDescription>{option.description}</ComboboxDescription>
              )}
            </ComboboxOption>
          ))}
        </Headless.ComboboxOptions>
      </Headless.Transition>
    </Headless.Combobox>
  )
}

function ComboboxOption<T>({
  children,
  className,
  ...props
}: { className?: string; children?: React.ReactNode } & Omit<
  Headless.ComboboxOptionProps<'div', T>,
  'className'
>) {
  const sharedClasses = clsx(
    // Base
    'flex min-w-0 items-center',
    // Icons
    '[&>[data-slot=icon]]:size-5 [&>[data-slot=icon]]:shrink-0 sm:[&>[data-slot=icon]]:size-4',
    '[&>[data-slot=icon]]:text-gray-500 [&>[data-slot=icon]]:group-data-[focus]/option:text-white [&>[data-slot=icon]]:dark:text-gray-400',
    'forced-colors:[&>[data-slot=icon]]:text-[CanvasText] forced-colors:[&>[data-slot=icon]]:group-data-[focus]/option:text-[Canvas]',
    // Avatars
    '[&>[data-slot=avatar]]:-mx-0.5 [&>[data-slot=avatar]]:size-6 sm:[&>[data-slot=avatar]]:size-5'
  )

  return (
    <Headless.ComboboxOption as={Fragment} {...props}>
      {({ selected }) => {
        return (
          <div
            className={clsx(
              // Basic layout
              'group/option grid cursor-default grid-cols-[theme(spacing.5),1fr] items-baseline gap-x-2 rounded-lg py-2.5 pl-2 pr-3.5 sm:grid-cols-[theme(spacing.4),1fr] sm:py-1.5 sm:pl-1.5 sm:pr-3',
              // Typography
              'text-base/6 text-gray-950 dark:text-white sm:text-sm/6 forced-colors:text-[CanvasText]',
              // Focus
              'outline-none data-[focus]:bg-primary-950 data-[focus]:text-white',
              // Forced colors mode
              'forced-color-adjust-none forced-colors:data-[focus]:bg-[Highlight] forced-colors:data-[focus]:text-[HighlightText]',
              // Disabled
              'data-[disabled]:opacity-50'
            )}
          >
            {selected ?
              <svg
                className="relative hidden size-5 self-center stroke-current group-data-[selected]/option:inline sm:size-4"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 8.5l3 3L12 4"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            : null}
            <span className={clsx(className, sharedClasses, 'col-start-2')}>
              {children}
            </span>
          </div>
        )
      }}
    </Headless.ComboboxOption>
  )
}

export function ComboboxLabel({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      {...props}
      className={clsx(
        className,
        'ml-2.5 truncate first:ml-0 sm:ml-2 sm:first:ml-0'
      )}
    />
  )
}

export function ComboboxDescription({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      {...props}
      className={clsx(
        className,
        'flex flex-1 overflow-hidden text-gray-500 before:w-2 before:min-w-0 before:shrink group-data-[focus]/option:text-white dark:text-gray-400'
      )}
    >
      <span className="flex-1 truncate">{children}</span>
    </span>
  )
}
