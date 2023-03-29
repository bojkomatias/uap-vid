'use client'
import { Protocol, Role, State } from '@prisma/client'
import { ACTION } from '@utils/zod'
import { useNotifications } from '@mantine/notifications'
import { useRouter } from 'next/navigation'
import { Button } from '@elements/Button'
import { canExecute } from '@utils/scopes'
import { useTransition } from 'react'

type ActionButtonTypes = { role: Role; protocol: Protocol }

const ApproveToReviewButton = ({ role, protocol }: ActionButtonTypes) => {
    const notification = useNotifications()
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    if (
        !protocol.id ||
        !canExecute(ACTION.APPROVE_TO_REVIEW, role, protocol.state)
    )
        return <></>

    const approveToReviewProtocol = async () => {
        const approved = await fetch(
            `/api/protocol/${protocol.id}/approveToReview`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: protocol.id }),
            }
        )
        if (approved.ok) {
            notification.showNotification({
                title: 'Protocolo publicado',
                message:
                    'El protocolo ha sido aprobado para evaluación con éxito',
                color: 'green',
            })
            return startTransition(() => router.refresh())
        }
        return notification.showNotification({
            title: 'No hemos podido aprobar el protocolo para evaluación',
            message: 'Lo lamentamos, ha ocurrido un error',
            color: 'red',
        })
    }

    return (
        <Button
            onClick={approveToReviewProtocol}
            intent={'primary'}
            disabled={protocol.state !== State.PUBLISHED || isPending}
        >
            Aprobar para evaluación
        </Button>
    )
}

export default ApproveToReviewButton
