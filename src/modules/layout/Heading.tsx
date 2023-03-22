import { ReactNode } from 'react'

export const Heading = ({ title }: { title: string | ReactNode }) => (
    <h2 className="mb-2 ml-4 mt-16 text-3xl font-bold text-black/70">
        {title}
    </h2>
)
