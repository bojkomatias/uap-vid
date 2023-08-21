import { cx } from '@utils/cx'
import type { ReactNode } from 'react'

export const Badge = ({
    children,
    className,
}: {
    children: ReactNode
    className?: string
}) => {
    return (
        <span
            className={cx(
                'inline-flex items-center rounded-md bg-black/5 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ',
                className
            )}
        >
            {children}
        </span>
    )
}
