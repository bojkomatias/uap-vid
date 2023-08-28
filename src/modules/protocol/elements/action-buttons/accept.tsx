'use client'
import type { Protocol, Review, Role } from '@prisma/client'
import { ReviewVerdict, State } from '@prisma/client'
import { notifications } from '@mantine/notifications'
import { useRouter } from 'next/navigation'
import { Button } from '@elements/button'
import { canExecute } from '@utils/scopes'
import { ACTION } from '@utils/zod'
import { useTransition } from 'react'
import { FileCheck } from 'tabler-icons-react'

type ActionButtonTypes = {
    role: Role
    protocol: Protocol
    reviews: Review[]
}

const AcceptButton = ({ role, protocol, reviews }: ActionButtonTypes) => {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    if (
        !protocol.id ||
        !canExecute(ACTION.ACCEPT, role, protocol.state) ||
        reviews.some((review) => review.verdict === ReviewVerdict.NOT_REVIEWED)
    )
        return <></>

    const acceptProtocol = async () => {
        const accepted = await fetch(`/api/protocol/${protocol.id}/accept`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: protocol.id, state: protocol.state }),
        })
        if (accepted.ok) {
            notifications.show({
                title: 'Protocolo aceptado',
                message:
                    'El protocolo ha sido aceptado para evaluación en comisión.',
                color: 'green',
            })
            return startTransition(() => router.refresh())
        }
        return notifications.show({
            title: 'No hemos podido aceptar el protocolo para evaluación en comisión',
            message: 'Lo lamentamos, ha ocurrido un error',
            color: 'red',
        })
    }

    return (
        <Button
            onClick={acceptProtocol}
            intent={'secondary'}
            disabled={protocol.state !== State.SCIENTIFIC_EVALUATION}
            loading={isPending}
        >
            <FileCheck className="h-5 text-current" />
            Aceptar
            <span className="ml-1 text-[0.5rem]">(a evaluar en comisión)</span>
        </Button>
    )
}

export default AcceptButton
