import { cx } from '@utils/cx'
import type { ReactNode } from 'react'

export default function ReviewContainer({
    title,
    children,
    fit,
}: {
    title: string | ReactNode
    children: ReactNode
    fit?: boolean
}) {
    return (
        <div
            className={cx(
                'w-full overflow-y-auto rounded border bg-gray-50 py-1 transition-all lg:w-96 2xl:w-[30rem]',
                fit ? 'max-h-[88svh]' : 'max-h-[96svh]'
            )}
        >
            <h3 className="ml-2 text-lg font-semibold text-gray-900">
                {title}
            </h3>
            {children}
        </div>
    )
}
