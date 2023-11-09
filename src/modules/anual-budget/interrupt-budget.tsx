'use client'
import { Button } from '@elements/button'
import { notifications } from '@elements/notifications'
import { interruptAnualBudget } from '@repositories/anual-budget'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export function InterruptAnualBudget({ id }: { id: string }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    return (
        <Button
            loading={isPending}
            intent="warning"
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
                    // TODO: Side effect on protocol should go here, if any!
                    notifications.show({
                        title: 'Presupuesto interrumpido',
                        message:
                            'El presupuesto fue dado de baja exitosamente.',
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
