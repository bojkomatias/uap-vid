'use client'

import { cx } from '@utils/cx'
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
                        className={cx(
                            'h-4 w-4 transition',
                            showAssignation && 'rotate-90'
                        )}
                    />
                </button>
            }
        >
            {showAssignation && children}
        </ItemContainer>
    )
}
