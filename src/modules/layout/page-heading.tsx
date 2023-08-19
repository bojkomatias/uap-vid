import type { ReactNode } from 'react'

export const PageHeading = ({ title }: { title: string | ReactNode }) => (
    <div className="mt-16">
        <h2 className="text-3xl font-bold text-black/70">{title}</h2>
    </div>
)
