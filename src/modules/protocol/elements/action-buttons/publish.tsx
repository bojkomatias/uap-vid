'use client'
import { Button } from '@elements/button'
import { Action, type User } from '@prisma/client'
import type { Protocol } from '@utils/zod'
import { ProtocolSchema } from '@utils/zod'
import { useMemo, useTransition } from 'react'
import { notifications } from '@elements/notifications'
import { useRouter } from 'next/navigation'
import InfoTooltip from '../tooltip'
import { Upload } from 'tabler-icons-react'
import { canExecute } from '@utils/scopes'

type ActionButtonTypes = {
  user: User
  protocol: Protocol
}

export default function PublishButton({ user, protocol }: ActionButtonTypes) {
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
      notifications.show({
        title: 'Protocolo publicado',
        message: 'El protocolo ha sido publicado con éxito',
        intent: 'success',
      })

      return startTransition(() => router.refresh())
    }
    return notifications.show({
      title: 'No hemos podido publicar el protocolo',
      message: 'Lo lamentamos, ha ocurrido un error',
      intent: 'error',
    })
  }

  const isValid = useMemo(
    () => ProtocolSchema.safeParse(protocol).success,
    [protocol]
  )

  if (
    !protocol.id ||
    user.id !== protocol.researcherId ||
    !canExecute(Action.PUBLISH, user.role, protocol.state)
  )
    return <></>

  if (!isValid)
    return (
      <div className="relative h-fit w-fit">
        <div className="absolute inset-0 z-10 mr-3">
          <InfoTooltip>
            <h4>
              El protocolo debe estar completo antes de poder ser publicado para
              evaluación.
            </h4>
            <p>
              Todas las secciones deben ser completadas antes de poder publicar
              un protocoló.
            </p>
            <p>
              Puede fijarse en la vista de edición del mismo que secciones
              faltan completar y si contiene algún error.
            </p>
          </InfoTooltip>
        </div>
        <Button intent={'secondary'} disabled={!isValid}>
          <Upload className="h-4 w-4 text-current" />
          Publicar
          <div className="w-4" />
        </Button>
      </div>
    )
  return (
    <Button onClick={publishProtocol} intent={'primary'} loading={isPending}>
      <Upload className="h-4 w-4 text-current" />
      Publicar
    </Button>
  )
}
