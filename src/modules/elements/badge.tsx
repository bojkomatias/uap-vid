import { cx } from '@utils/cx'
import type { ReactNode } from 'react'

export const Badge = ({
  children,
  className,
  title,
}: {
  children: ReactNode
  className?: string
  title?: string
}) => {
  return (
    <span
      title={title}
      className={cx(
        'inline-flex items-center rounded-md bg-gray-200/40 px-2 py-1 text-xs font-semibold text-gray-600 ring-1 ring-inset',
        className
      )}
    >
      {children}
    </span>
  )
}
