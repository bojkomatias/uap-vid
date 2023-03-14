import { ReactNode } from 'react'

export const Heading = ({ title }: { title: string | ReactNode }) => (
    <div className="mb-2 text-3xl font-bold text-black/70">{title}</div>
)
