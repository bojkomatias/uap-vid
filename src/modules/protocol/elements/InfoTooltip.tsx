import { ReactNode } from 'react'
import { InfoCircle } from 'tabler-icons-react'

export default function InfoTooltip({ children }: { children: ReactNode }) {
    return (
        <div className="group relative w-full pointer-events-none flex justify-end">
            <InfoCircle className="h-4 w-4 cursor-help text-base-600 group-hover:scale-105 pointer-events-auto" />

            <div className="absolute top-5 right-0 prose text-[0.66rem] sm:text-sm prose-sm prose-zinc z-10 hidden bg-base-100 p-3 shadow-lg transition-all duration-200 group-hover:block prose-p:pl-2 ">
                {children}
            </div>
        </div>
    )
}
