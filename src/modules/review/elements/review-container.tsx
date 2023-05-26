import clsx from 'clsx'
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
            className={clsx(
                fit ? 'max-h-[88svh]' : 'max-h-[96svh]',
                'w-full overflow-y-auto rounded border bg-gray-50 py-1 transition-all lg:w-96 2xl:w-[30rem]'
            )}
        >
            <h3 className="ml-2 text-lg font-semibold text-gray-900">
                {title}
            </h3>
            {children}
        </div>
    )
}
