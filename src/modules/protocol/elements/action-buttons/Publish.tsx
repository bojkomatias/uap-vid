'use client'
import { Button } from '@elements/Button'
import { protocol } from '@prisma/client'
import { canExecute } from '@utils/scopes'
import { ACTION, ProtocolSchema, RoleType, StateType } from '@utils/zod'
import { useMemo } from 'react'

type ActionButtonTypes = { role: RoleType; protocol: protocol }

const publishProtocol = async () => {
    const res = await fetch(``)
}

export default function PublishButton({ role, protocol }: ActionButtonTypes) {
    const isValid = useMemo(
        () => ProtocolSchema.safeParse(protocol).success,
        [protocol]
    )
    if (!protocol.id || !isValid)
        return (
            <Button intent={'primary'} disabled>
                Publicar
            </Button>
        )
    if (canExecute(ACTION.PUBLISH, role, protocol.state))
        return <Button intent={'primary'}>Publicar</Button>
    return <></>
}
