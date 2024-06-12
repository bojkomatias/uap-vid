'use client'
import { Action, type ProtocolState, type Role } from '@prisma/client'
import { notifications } from '@elements/notifications'
import { useRouter } from 'next/navigation'
import { Button } from '@elements/button'
import { canExecute } from '@utils/scopes'
import { useTransition } from 'react'

type ActionButtonTypes = {
    role: Role
    protocol: { id: string; state: ProtocolState }
}

export const FinishButton = ({ role, protocol }: ActionButtonTypes) => {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    if (!protocol.id || !canExecute(Action.FINISH, role, protocol.state))
        return <></>

    const markAsFinished = async () => {
        const res = await fetch(`/api/protocol/${protocol.id}/finish`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: protocol.id, state: protocol.state }),
        })
        if (res.ok) {
            notifications.show({
                title: 'Proyecto finalizado',
                message: 'El protocolo ha sido marcado como finalizado',
                intent: 'success',
            })
            return startTransition(() => router.refresh())
        }
        return notifications.show({
            title: 'No hemos podido marcar el protocolo como finalizado',
            message: 'Lo lamentamos, ha ocurrido un error',
            intent: 'error',
        })
    }

    return (
        <Button
            onClick={markAsFinished}
            intent={'secondary'}
            loading={isPending}
        >
            Finalizado
        </Button>
    )
}
