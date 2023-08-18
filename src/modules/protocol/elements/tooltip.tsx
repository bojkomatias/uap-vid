import { cx } from '@utils/cx'
import type { ReactNode } from 'react'
import { InfoCircle } from 'tabler-icons-react'

export default function InfoTooltip({
    children,
    className,
}: {
    children: ReactNode
    className?: string
}) {
    return (
        <div className="group pointer-events-none relative flex h-0 justify-end">
            <InfoCircle className="pointer-events-auto mt-3.5 h-4 w-4 cursor-help text-base-600 group-hover:scale-105" />

            <div
                className={cx(
                    'prose prose-zinc inset-auto z-10 mr-6 min-w-[30vw] rounded bg-white p-3 text-xs opacity-0 shadow-xl shadow-gray-400 ring-1 ring-inset ring-black/5 transition delay-75 group-hover:opacity-100 group-hover:delay-500 prose-p:pl-2',
                    className ?? 'absolute'
                )}
            >
                {children}
            </div>
        </div>
    )
}
