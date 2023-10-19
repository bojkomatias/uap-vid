'use client'
import type { State, Role } from '@prisma/client'
import { ACTION } from '@utils/zod'
import { notifications } from '@mantine/notifications'
import { useRouter } from 'next/navigation'
import { Button } from '@elements/button'
import { canExecute } from '@utils/scopes'
import { useTransition } from 'react'

type ActionButtonTypes = { role: Role; protocol: { id: string; state: State } }

export const FinishButton = ({ role, protocol }: ActionButtonTypes) => {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    if (!protocol.id || !canExecute(ACTION.FINISH, role, protocol.state))
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
                color: 'green',
            })
            return startTransition(() => router.refresh())
        }
        return notifications.show({
            title: 'No hemos podido marcar el protocolo como finalizado',
            message: 'Lo lamentamos, ha ocurrido un error',
            color: 'red',
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
