'use client'
import { Button } from '@elements/Button'
import { Protocol } from '@prisma/client'
import { canExecute } from '@utils/scopes'
import { ACTION, ProtocolSchema, RoleType, StateType } from '@utils/zod'
import { useMemo } from 'react'
import { useNotifications } from '@mantine/notifications'

type ActionButtonTypes = { role: RoleType; protocol: Protocol }

export default function PublishButton({ role, protocol }: ActionButtonTypes) {
    const notification = useNotifications()
    const publishProtocol = async () => {
        const published = await fetch('/api/protocols/state/publish', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: protocol.id }),
        })
        if (published.ok) {
            notification.showNotification({
                title: 'Protocolo publicado',
                message: 'El protocolo ha sido publicado con éxito',
                color: 'green',
            })
        }
        notification.showNotification({
            title: 'No hemos podido publicar el protocolo',
            message: 'Lo lamentamos, ha ocurrido un error',
            color: 'red',
        })
    }
    const isValid = useMemo(
        () => ProtocolSchema.safeParse(protocol).success,
        [protocol]
    )
    if (!protocol.id || !canExecute(ACTION.PUBLISH, role, protocol.state))
        return <></>
    return (
        <Button
            onClick={publishProtocol}
            intent={'primary'}
            disabled={!isValid}
        >
            Publicar
        </Button>
    )
}
