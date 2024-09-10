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
      disabled={isPending}
      onClick={async () => {
        const res = await rejectAnualBudget(id)

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
          title: 'Error al rechazar',
          message:
            'Ocurrió un error al rechazar el presupuesto, intente de nuevo',
          intent: 'error',
        })
      }}
    >
      Rechazar presupuesto <X />
    </Button>
  )
}
