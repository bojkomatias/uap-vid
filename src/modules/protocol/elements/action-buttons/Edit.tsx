'use client'
import { Button } from '@elements/Button'
import { canExecute } from '@utils/scopes'
import { ACTION, RoleType, StateType } from '@utils/zod'
import Link from 'next/link'

type ActionButtonTypes = { role: RoleType; state: StateType; id: string }

export default function EditButton(props: ActionButtonTypes) {
    if (canExecute(ACTION.EDIT, props.role, props.state))
        return (
            <Button intent={'secondary'}>
                <Link href={`/protected/protocol/${props.id}`}>Editar</Link>
            </Button>
        )
    return <></>
}
