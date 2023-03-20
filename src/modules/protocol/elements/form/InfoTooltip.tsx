import clsx from 'clsx'
import { ReactNode } from 'react'
import { InfoCircle } from 'tabler-icons-react'

export default function InfoTooltip({
    children,
    className,
}: {
    children: ReactNode
    className?: string
}) {
    return (
        <div className="group relative pointer-events-none flex justify-end h-0">
            <InfoCircle className="mt-3.5 h-4 w-4 cursor-help text-base-600 group-hover:scale-105 pointer-events-auto" />

            <div
                className={clsx(
                    'delay-75 ring-1 ring-gray-300 ring-inset rounded inset-auto mr-6 prose text-xs prose-zinc z-10 opacity-0 bg-white p-3 shadow-xl shadow-gray-400 transition group-hover:opacity-100 prose-p:pl-2 group-hover:delay-500',
                    className ?? 'absolute'
                )}
            >
                {children}
            </div>
        </div>
    )
}
