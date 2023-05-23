import type { State } from '@prisma/client'
import ProtocolStatesDictionary from '@utils/dictionaries/ProtocolStatesDictionary'
import type { ReactNode } from 'react'

export const PageHeading = ({
    title,
    state,
}: {
    title: string | ReactNode
    state?: State
}) => (
    <div className="mt-16">
        <h2 className="text-3xl font-bold text-black/70">{title}</h2>
        {state ? (
            <span className="rounded border bg-gray-50 px-2 py-0.5 text-xs font-semibold uppercase text-gray-600">
                {ProtocolStatesDictionary[state]}
            </span>
        ) : null}
    </div>
)
