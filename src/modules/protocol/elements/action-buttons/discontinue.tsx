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

export const DiscontinueButton = ({ role, protocol }: ActionButtonTypes) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  if (!protocol.id || !canExecute(Action.DISCONTINUE, role, protocol.state))
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
        intent: 'success',
      })
      return startTransition(() => router.refresh())
    }
    return notifications.show({
      title: 'No hemos podido discontinuar el protocolo',
      message: 'Lo lamentamos, ha ocurrido un error',
      intent: 'error',
    })
  }

  return (
    <Button
      onClick={discontinueProtocol}
      intent={'warning'}
      loading={isPending}
    >
      Discontinuar
    </Button>
  )
}
