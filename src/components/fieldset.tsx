import * as Headless from '@headlessui/react'
import clsx from 'clsx'

export function Fieldset({
  className,
  ...props
}: { className?: string } & Omit<Headless.FieldsetProps, 'className'>) {
  return (
    <Headless.Fieldset
      {...props}
      className={clsx(
        className,
        '[&>*+[data-slot=control]]:mt-6 [&>[data-slot=text]]:mt-1'
      )}
    />
  )
}

export function Legend({
  className,
  ...props
}: { className?: string } & Omit<Headless.LegendProps, 'className'>) {
  return (
    <Headless.Legend
      data-slot="legend"
      {...props}
      className={clsx(
        className,
        'text-base/6 font-semibold text-gray-950 data-[disabled]:opacity-50 dark:text-white sm:text-sm/6'
      )}
    />
  )
}

export function FieldGroup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      data-slot="control"
      {...props}
      className={clsx(className, 'space-y-8')}
    />
  )
}

export function Field({
  className,
  ...props
}: { className?: string } & Omit<Headless.FieldProps, 'className'>) {
  return (
    <Headless.Field
      {...props}
      className={clsx(
        className,
        '[&>[data-slot=label]+[data-slot=control]]:mt-3',
        '[&>[data-slot=label]+[data-slot=description]]:mt-1',
        '[&>[data-slot=description]+[data-slot=control]]:mt-3',
        '[&>[data-slot=control]+[data-slot=description]]:mt-3',
        '[&>[data-slot=control]+[data-slot=error]]:mt-3',
        '[&>[data-slot=label]]:font-medium'
      )}
    />
  )
}

export function Label({
  className,
  ...props
}: { className?: string } & Omit<Headless.LabelProps, 'className'>) {
  return (
    <Headless.Label
      data-slot="label"
      {...props}
      className={clsx(
        className,
        'select-none text-base/6 text-gray-950 data-[disabled]:opacity-50 dark:text-white sm:text-sm/6'
      )}
    />
  )
}

export function Description({
  className,
  ...props
}: { className?: string } & Omit<Headless.DescriptionProps, 'className'>) {
  return (
    <Headless.Description
      data-slot="description"
      {...props}
      className={clsx(
        className,
        'text-base/6 text-gray-500 data-[disabled]:opacity-50 dark:text-gray-400 sm:text-sm/6'
      )}
    />
  )
}

export function ErrorMessage({
  className,
  ...props
}: { className?: string } & Omit<Headless.DescriptionProps, 'className'>) {
  return (
    <Headless.Description
      data-slot="error"
      {...props}
      className={clsx(
        className,
        'text-base/6 text-red-600 data-[disabled]:opacity-50 dark:text-red-500 sm:text-sm/6'
      )}
    />
  )
}
