'use client'
import { Protocol, Role, State } from '@prisma/client'
import { ACTION } from '@utils/zod'
import { useNotifications } from '@mantine/notifications'
import { useRouter } from 'next/navigation'
import { Button } from '@elements/button'
import { canExecute } from '@utils/scopes'
import { useTransition } from 'react'

type ActionButtonTypes = { role: Role; protocol: Protocol }

const ApproveButton = ({ role, protocol }: ActionButtonTypes) => {
    const notification = useNotifications()
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    if (!protocol.id || !canExecute(ACTION.APPROVE, role, protocol.state))
        return <></>

    const approveProtocol = async () => {
        const approved = await fetch(`/api/protocol/${protocol.id}/approve`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: protocol.id }),
        })
        if (approved.ok) {
            notification.showNotification({
                title: 'Protocolo publicado',
                message: 'El protocolo ha sido aprobado, ahora está en curso',
                color: 'green',
            })
            return startTransition(() => router.refresh())
        }
        return notification.showNotification({
            title: 'No hemos podido aprobar el protocolo',
            message: 'Lo lamentamos, ha ocurrido un error',
            color: 'red',
        })
    }

    return (
        <Button
            onClick={approveProtocol}
            intent={'primary'}
            disabled={protocol.state !== State.ACCEPTED || isPending}
        >
            {/* No se que texto poner acá jepz */}
            Aprobar: En curso
        </Button>
    )
}

export default ApproveButton
