import clsx from 'clsx'

export function DescriptionList({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'dl'>) {
  return (
    <dl
      {...props}
      className={clsx(
        className,
        'grid grid-cols-1 text-base/6 sm:text-sm/6 print:grid-cols-1'
      )}
    />
  )
}

export function DescriptionTerm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'dt'>) {
  return (
    <dt
      {...props}
      className={clsx(
        className,
        'col-start-1 border-t border-gray-950/5 pt-3 text-gray-500 first:border-none dark:border-white/5 dark:text-gray-400 sm:border-t sm:border-gray-950/5 sm:py-3 sm:dark:border-white/5'
      )}
    />
  )
}

export function DescriptionDetails({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'dd'>) {
  return (
    <dd
      {...props}
      className={clsx(
        className,
        'pb-3 pt-1 text-gray-950 dark:text-white sm:border-t sm:border-gray-950/5 sm:py-3 dark:sm:border-white/5 print:max-w-2xl sm:[&:nth-child(2)]:border-none'
      )}
    />
  )
}
