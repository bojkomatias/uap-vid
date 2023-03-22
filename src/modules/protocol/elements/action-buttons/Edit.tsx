import { Button } from '@elements/Button'
import { canExecute } from '@utils/scopes'
import { ACTION, RoleType, StateType } from '@utils/zod'
import Link from 'next/link'

type ActionButtonTypes = { role: RoleType; state: StateType; id: string }

export default function EditButton(props: ActionButtonTypes) {
    console.log(!canExecute(ACTION.EDIT, props.role, props.state))
    if (!canExecute(ACTION.EDIT, props.role, props.state)) return <></>
    return (
        <Link href={`/protocols/${props.id}/0`} passHref>
            <Button intent={'secondary'}>Editar</Button>
        </Link>
    )
}
