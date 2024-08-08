'use client'
import { Button } from '@components/button'
import { notifications } from '@elements/notifications'
import { approveAnualBudget } from '@repositories/anual-budget'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { Check } from 'tabler-icons-react'

export function ApproveAnualBudget({ id }: { id: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  return (
    <Button
      outline
      disabled={isPending}
      onClick={async () => {
        const res = await approveAnualBudget(id)

        if (res) {
          notifications.show({
            title: 'Presupuesto aprobado',
            message: 'El presupuesto fue aprobado con éxito',
            intent: 'success',
          })
          return startTransition(() => router.refresh())
        }
        return notifications.show({
          title: 'Error al aprobar',
          message:
            'Ocurrió un error al aprobar el presupuesto, intente de nuevo',
          intent: 'error',
        })
      }}
    >
      Aprobar presupuesto <Check />
    </Button>
  )
}
