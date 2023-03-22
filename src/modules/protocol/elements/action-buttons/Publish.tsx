'use client'
import { Button } from '@elements/Button'
import { Protocol } from '@prisma/client'
import { canExecute } from '@utils/scopes'
import { ACTION, ProtocolSchema, RoleType, StateType } from '@utils/zod'
import { useMemo } from 'react'

type ActionButtonTypes = { role: RoleType; protocol: Protocol }

const publishProtocol = async () => {
    const res = await fetch(``)
}

export default function PublishButton({ role, protocol }: ActionButtonTypes) {
    const isValid = useMemo(
        () => ProtocolSchema.safeParse(protocol).success,
        [protocol]
    )
    if (!protocol.id || !canExecute(ACTION.PUBLISH, role, protocol.state))
        return <></>
    if (!isValid)
        return (
            <Button intent={'primary'} disabled>
                Publicar
            </Button>
        )
    return <Button intent={'primary'}>Publicar</Button>
}
