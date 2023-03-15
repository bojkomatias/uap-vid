import { ReactNode } from 'react'
import { InfoCircle } from 'tabler-icons-react'

export default function InfoTooltip({ children }: { children: ReactNode }) {
    return (
        <div className="group relative w-full pointer-events-none flex justify-end h-0">
            <InfoCircle className="-mt-4 h-4 w-4 cursor-help text-base-600 group-hover:scale-105 pointer-events-auto" />

            <div className="delay-75 ring-1 ring-gray-300 rounded absolute top-5 right-0 prose text-[0.66rem] sm:text-sm prose-sm prose-zinc z-10 opacity-0 bg-base-50 p-3 shadow-lg transition group-hover:opacity-100 prose-p:pl-2 group-hover:delay-500">
                {children}
            </div>
        </div>
    )
}
