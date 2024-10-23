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
      disabled={isPending}
      onClick={async () => {
        const res = await interruptAnualBudget(id)

        if (res) {
          notifications.show({
            title: 'Presupuesto interrumpido',
            message:
              'El presupuesto fue dado de baja exitosamente. También el proyecto ha sido discontinuado.',
            intent: 'success',
          })
          return startTransition(() => router.refresh())
        }
        return notifications.show({
          title: 'Error al interrumpir',
          message:
            'Ocurrió un error al aprobar el presupuesto, intente de nuevo',
          intent: 'error',
        })
      }}
    >
      Interrumpir
    </Button>
  )
}
