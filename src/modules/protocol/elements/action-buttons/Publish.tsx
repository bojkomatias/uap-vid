'use client'
import { Button } from '@elements/Button'
import { canExecute } from '@utils/scopes'
import { ACTION, RoleType, StateType } from '@utils/zod'

type ActionButtonTypes = { role: RoleType; state: StateType }

const publishProtocol = async () => {
    const res = await fetch(``)
}

export default function PublishButton(props: ActionButtonTypes) {
    return (
        <div className="gap-4 flex justify-end mr-4">
            {canExecute(ACTION.PUBLISH, props.role, props.state) ? (
                <Button intent={'primary'}>Publicar</Button>
            ) : null}
        </div>
    )
}
