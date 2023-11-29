'use client'
import { buttonStyle } from '@elements/button/styles'
import type { Review, State, User } from '@prisma/client'
import { canExecute } from '@utils/scopes'
import { ACTION, STATE } from '@utils/zod'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Edit } from 'tabler-icons-react'

type ActionButtonTypes = {
    user: User
    protocol: { researcherId: string; state: State; id: string }
    reviews: Review[]
}

export default function EditButton({
    user,
    protocol,
    reviews,
}: ActionButtonTypes) {
    const path = usePathname()

    if (path?.split('/')[3]) return <></>
    if (
        !canExecute(
            user.id === protocol.researcherId
                ? ACTION.EDIT_BY_OWNER
                : ACTION.EDIT,
            user.role,
            protocol.state
        ) ||
        protocol.state === STATE.SCIENTIFIC_EVALUATION ||
        (protocol.state === STATE.METHODOLOGICAL_EVALUATION &&
            reviews.length > 2 &&
            reviews.every((r) => r.verdict === 'APPROVED'))
    )
        return <></>
    return (
        <Link
            href={`/protocols/${protocol.id}/0`}
            className={buttonStyle('secondary')}
        >
            <Edit className="h-4 w-4 text-current" />
            Editar
        </Link>
    )
}
