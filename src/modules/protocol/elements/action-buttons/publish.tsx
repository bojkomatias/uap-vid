'use client'
import { Button } from '@elements/button'
import type { Protocol } from '@prisma/client'
import type { Protocol as ProtocolZod, RoleType } from '@utils/zod'
import { canExecute } from '@utils/scopes'
import { ACTION, ProtocolSchema } from '@utils/zod'
import { useMemo, useTransition } from 'react'
import { useNotifications } from '@mantine/notifications'
import { useRouter } from 'next/navigation'
import InfoTooltip from '../tooltip'

type ActionButtonTypes = { role: RoleType; protocol: Protocol | ProtocolZod }

export default function PublishButton({ role, protocol }: ActionButtonTypes) {
    const notification = useNotifications()
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const publishProtocol = async () => {
        const published = await fetch(`/api/protocol/${protocol.id}/publish`, {
            method: 'PUT',
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
            return startTransition(() => router.refresh())
        }
        return notification.showNotification({
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

    if (!isValid)
        return (
            <div className="relative h-fit w-fit">
                <div className="absolute inset-0 z-10 mr-3">
                    <InfoTooltip>
                        <h4>
                            El protocolo debe estar completo antes de poder ser
                            publicado para evaluación.
                        </h4>
                        <p>
                            Todas las secciones deben ser completadas antes de
                            poder publicar un protocoló.
                        </p>
                        <p>
                            Puede fijarse en la vista de edición del mismo que
                            secciones faltan completar y si contiene algún
                            error.
                        </p>
                    </InfoTooltip>
                </div>
                <Button intent={'primary'} disabled={!isValid}>
                    Publicar
                    <div className="w-4" />
                </Button>
            </div>
        )
    return (
        <Button
            onClick={publishProtocol}
            intent={'primary'}
            loading={isPending}
        >
            Publicar
        </Button>
    )
}
