import type { ReactNode } from 'react'

export const PageHeading = ({ title }: { title: string | ReactNode }) => (
    <div className="ml-2 mt-16">
        <h2 className="text-2xl font-bold leading-10 text-black/70">{title}</h2>
    </div>
)
