import { clsx } from 'clsx'
import { Link } from './link'
import { cx } from '@utils/cx'

export function Text({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'p'>) {
  return (
    <p
      data-slot="text"
      {...props}
      className={cx(
        'text-base/6 text-gray-500 dark:text-gray-400 sm:text-sm/6 ',
        className
      )}
    />
  )
}

export function TextLink({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link>) {
  return (
    <Link
      {...props}
      className={clsx(
        className,
        'text-gray-950 underline decoration-gray-950/50 data-[hover]:decoration-gray-950 dark:text-white dark:decoration-white/50 dark:data-[hover]:decoration-white'
      )}
    />
  )
}

export function Strong({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'strong'>) {
  return (
    <strong
      {...props}
      className={clsx(className, 'font-medium text-gray-950 dark:text-white')}
    />
  )
}

export function Code({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'code'>) {
  return (
    <code
      {...props}
      className={clsx(
        className,
        'rounded border border-gray-950/10 bg-gray-950/[2.5%] px-0.5 text-sm font-medium text-gray-950 dark:border-white/20 dark:bg-white/5 dark:text-white sm:text-[0.8125rem]'
      )}
    />
  )
}
