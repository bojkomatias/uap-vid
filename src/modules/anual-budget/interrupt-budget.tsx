'use client'
import { Button } from '@components/button'
import { notifications } from '@elements/notifications'
import { interruptAnualBudget } from '@repositories/anual-budget'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export function InterruptAnualBudget({
  id,
  protocolId,
}: {
  id: string
  protocolId: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  return (
    <Button
      color="red"
      onClick={async () => {
        const res = await interruptAnualBudget(id)

        if (!res)
          return notifications.show({
            title: 'Error al interrumpir',
            message:
              'Ocurrió un error al aprobar el presupuesto, intente de nuevo',
            intent: 'error',
          })
        if (res) {
          // Side effect on protocol change state to Discontinued!
          await fetch(`/api/protocol/${protocolId}/discontinue`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: protocolId,
              // Always the same, ongoing if it has budget.
              // But this should be the only way... so static to unify the flow
              state: 'ACCEPTED',
            }),
          })
          notifications.show({
            title: 'Presupuesto interrumpido',
            message:
              'El presupuesto fue dado de baja exitosamente. También el proyecto ha sido discontinuado.',
            intent: 'success',
          })
          startTransition(() => router.refresh())
        }
      }}
    >
      Interrumpir
    </Button>
  )
}
