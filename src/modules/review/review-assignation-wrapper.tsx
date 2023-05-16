'use client'

import clsx from 'clsx'
import { useState } from 'react'
import { ChevronRight } from 'tabler-icons-react'
import ItemContainer from './elements/review-container'

export default function ReviewAssignationWrapper({
    children,
}: {
    children: React.ReactNode
}) {
    const [showAssignation, setShowAssignation] = useState(false)
    return (
        <ItemContainer
            title={
                <button
                    onClick={() => setShowAssignation((prv) => !prv)}
                    className="my-1.5 flex cursor-pointer items-center gap-3 focus:outline-0"
                >
                    <span>Evaluadores</span>
                    <ChevronRight
                        className={clsx('h-4 w-4 transition', {
                            'rotate-90': showAssignation,
                        })}
                    />
                </button>
            }
        >
            {showAssignation && children}
        </ItemContainer>
    )
}
