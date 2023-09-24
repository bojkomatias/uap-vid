'use client'
import type { Role } from '@prisma/client'
import { State } from '@prisma/client'
import { ACTION } from '@utils/zod'
import { notifications } from '@mantine/notifications'
import { useRouter } from 'next/navigation'
import { Button } from '@elements/button'
import { canExecute } from '@utils/scopes'
import { useTransition } from 'react'
import { FileCertificate } from 'tabler-icons-react'

type ActionButtonTypes = { role: Role; protocol: { id: string; state: State } }

const ApproveButton = ({ role, protocol }: ActionButtonTypes) => {
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
            body: JSON.stringify({ id: protocol.id, state: protocol.state }),
        })
        if (approved.ok) {
            notifications.show({
                title: 'Protocolo aprobado',
                message: 'El protocolo ha sido aprobado, ahora está en curso',
                color: 'green',
            })
            return startTransition(() => router.refresh())
        }
        return notifications.show({
            title: 'No hemos podido aprobar el protocolo',
            message: 'Lo lamentamos, ha ocurrido un error',
            color: 'red',
        })
    }

    return (
        <Button
            onClick={approveProtocol}
            intent={'secondary'}
            disabled={protocol.state! !== State.ACCEPTED}
            loading={isPending}
        >
            <FileCertificate className="h-5 text-current" />
            Aprobar: En curso
        </Button>
    )
}

export default ApproveButton
