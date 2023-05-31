'use client'
import { Button } from '@elements/button'
import type { Review, User } from '@prisma/client'
import { canExecute } from '@utils/scopes'
import type { StateType } from '@utils/zod'
import { ACTION } from '@utils/zod'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Edit } from 'tabler-icons-react'

type ActionButtonTypes = {
    user: User
    researcherId: string
    state: StateType
    id: string
    reviews: Review[]
}

export default function EditButton(props: ActionButtonTypes) {
    const path = usePathname()
    console.log(props)
    if (path?.split('/')[3]) return <></>
    if (
        !canExecute(
            props.user.id === props.researcherId
                ? ACTION.EDIT_BY_OWNER
                : ACTION.EDIT,
            props.user.role,
            props.state
        ) ||
        (props.reviews.length > 2 &&
            props.reviews.every((r) => r.verdict === 'APPROVED'))
    )
        return <></>
    return (
        <Link href={`/protocols/${props.id}/0`} passHref>
            <Button intent={'secondary'}>
                <Edit className="mr-2 h-5" />
                Editar
            </Button>
        </Link>
    )
}
