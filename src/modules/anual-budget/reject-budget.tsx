'use client'
import { Button } from '@components/button'
import { notifications } from '@elements/notifications'
import { rejectAnualBudget } from '@repositories/anual-budget'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { X } from 'tabler-icons-react'

export function RejectAnualBudget({ id }: { id: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  return (
    <Button
      outline
      onClick={async () => {
        const res = await rejectAnualBudget(id)

        if (!res)
          return notifications.show({
            title: 'Error al rechazar',
            message:
              'Ocurrió un error al rechazar el presupuesto, intente de nuevo',
            intent: 'error',
          })
        if (res) {
          // Side effect on protocol change state to Discontinued!
          await fetch(`/api/protocol/${res.protocol.id}/discontinue`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: res.protocol.id,
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
      Rechazar presupuesto <X />
    </Button>
  )
}
