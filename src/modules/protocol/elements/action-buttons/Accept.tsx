'use client'
import { Protocol, Role, State } from '@prisma/client'
import { useNotifications } from '@mantine/notifications'
import { useRouter } from 'next/navigation'
import { Button } from '@elements/Button'
import { canExecute } from '@utils/scopes'
import { ACTION } from '@utils/zod'
import { useTransition } from 'react'

type ActionButtonTypes = { role: Role; protocol: Protocol }

const AcceptButton = ({ role, protocol }: ActionButtonTypes) => {
    const notification = useNotifications()
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    if (!protocol.id || !canExecute(ACTION.ACCEPT, role, protocol.state))
        return <></>

    const acceptProtocol = async () => {
        const accepted = await fetch(`/api/protocol/${protocol.id}/accept`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: protocol.id }),
        })
        if (accepted.ok) {
            notification.showNotification({
                title: 'Protocolo aceptado',
                message:
                    'El protocolo ha sido aceptado para evaluación en comisión.',
                color: 'green',
            })
            return startTransition(() => router.refresh())
        }
        return notification.showNotification({
            title: 'No hemos podido aceptar el protocolo para evaluación en comisión',
            message: 'Lo lamentamos, ha ocurrido un error',
            color: 'red',
        })
    }

    return (
        <Button
            onClick={acceptProtocol}
            intent={'primary'}
            disabled={
                protocol.state !== State.SCIENTIFIC_EVALUATION || isPending
            }
        >
            Aceptar para evaluación en comisión
        </Button>
    )
}

export default AcceptButton