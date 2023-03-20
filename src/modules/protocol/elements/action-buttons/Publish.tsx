'use client'
import { Button } from '@elements/Button'
import { canExecute } from '@utils/scopes'
import { ACTION, RoleType, StateType } from '@utils/zod'

type ActionButtonTypes = { role: RoleType; state: StateType }

const publishProtocol = async () => {
    const res = await fetch(``)
}

export default function PublishButton(props: ActionButtonTypes) {
    if (canExecute(ACTION.PUBLISH, props.role, props.state))
        return <Button intent={'primary'}>Publicar</Button>
    return <></>
}
