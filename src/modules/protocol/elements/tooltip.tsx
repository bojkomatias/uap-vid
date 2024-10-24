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
      <InfoCircle className="pointer-events-auto mt-2 h-4 w-4 cursor-help text-gray-600 transition delay-500 duration-300 hover:scale-110 hover:text-primary hover:delay-100" />

      <div
        className={cx(
          'prose prose-zinc prose-p:pl-2 inset-auto z-10 mr-6 min-w-[20vw] origin-top-right scale-95 rounded bg-white p-3 text-xs/6 opacity-0 shadow-md ring-1 ring-inset transition delay-300 duration-150 ease-in-out group-hover:scale-100 group-hover:opacity-100 group-hover:delay-100',
          className ?? 'absolute'
        )}
      >
        {children}
      </div>
    </div>
  )
}
