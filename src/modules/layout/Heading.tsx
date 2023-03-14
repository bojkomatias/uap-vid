import { ReactNode } from 'react'

export const Heading = ({ title }: { title: string | ReactNode }) => (
    <div className="mb-8 text-4xl font-bold text-primary">{title}</div>
)
