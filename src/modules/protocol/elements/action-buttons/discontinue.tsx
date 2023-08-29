'use client'
import type { State, Role } from '@prisma/client'
import { ACTION } from '@utils/zod'
import { notifications } from '@mantine/notifications'
import { useRouter } from 'next/navigation'
import { Button } from '@elements/button'
import { canExecute } from '@utils/scopes'
import { useTransition } from 'react'

type ActionButtonTypes = { role: Role; protocol: { id: string; state: State } }

export const DiscontinueButton = ({ role, protocol }: ActionButtonTypes) => {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    if (!protocol.id || !canExecute(ACTION.DISCONTINUE, role, protocol.state))
        return <></>

    const discontinueProtocol = async () => {
        const res = await fetch(`/api/protocol/${protocol.id}/discontinue`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: protocol.id, state: protocol.state }),
        })
        if (res.ok) {
            notifications.show({
                title: 'Protocolo discontinuado',
                message: 'El protocolo ha sido marcado como discontinuado',
                color: 'green',
            })
            return startTransition(() => router.refresh())
        }
        return notifications.show({
            title: 'No hemos podido discontinuar el protocolo',
            message: 'Lo lamentamos, ha ocurrido un error',
            color: 'red',
        })
    }

    return (
        <Button
            onClick={discontinueProtocol}
            intent={'destructive'}
            loading={isPending}
        >
            Discontinuar
        </Button>
    )
}
