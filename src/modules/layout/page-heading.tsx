import type { ReactNode } from 'react'

export const PageHeading = ({ title }: { title: string | ReactNode }) => (
    <div className="mx-auto mt-16 max-w-7xl pl-2">
        <h2 className="text-2xl font-bold leading-10 text-black/70">{title}</h2>
    </div>
)
