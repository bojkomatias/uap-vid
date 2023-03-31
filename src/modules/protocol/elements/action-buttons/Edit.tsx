'use client'
import { Button } from '@elements/custom-button'
import { canExecute } from '@utils/scopes'
import { ACTION, RoleType, StateType } from '@utils/zod'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type ActionButtonTypes = { role: RoleType; state: StateType; id: string }

export default function EditButton(props: ActionButtonTypes) {
    const path = usePathname()
    if (path?.split('/')[3]) return <></>
    if (!canExecute(ACTION.EDIT, props.role, props.state)) return <></>
    return (
        <Link href={`/protocols/${props.id}/0`} passHref>
            <Button intent={'secondary'}>Editar</Button>
        </Link>
    )
}
