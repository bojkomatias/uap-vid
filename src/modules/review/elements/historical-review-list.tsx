'use client'

import type { Review, Role, User } from '@prisma/client'
import clsx from 'clsx'
import { useState } from 'react'
import { ChevronRight } from 'tabler-icons-react'
import ReviewItem from './review-item'

export function HistoricalReviewList({
    role,
    reviews,
}: {
    role: Role
    reviews: (Review & { reviewer: User })[]
}) {
    const [showHistorical, setShowHistorical] = useState(false)

    return (
        <>
            <button
                onClick={() => setShowHistorical((prv) => !prv)}
                className="flex cursor-pointer items-center gap-3 focus:outline-0"
            >
                <span className="ml-2 text-sm font-semibold leading-10 text-gray-700">
                    Revisiones históricas
                </span>
                <ChevronRight
                    className={clsx('h-4 w-4 transition', {
                        'rotate-90': showHistorical,
                    })}
                />
            </button>
            <ul role="list" className="space-y-3 px-1">
                {showHistorical &&
                    reviews.map((r, i) => (
                        <ReviewItem key={i} review={r} role={role} />
                    ))}
            </ul>
        </>
    )
}
