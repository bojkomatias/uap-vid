import type { ReactNode } from 'react'

export const PageHeading = ({ title }: { title: string | ReactNode }) => (
    <h2 className="mb-2 mt-16 text-3xl font-bold text-black/70">{title}</h2>
)
