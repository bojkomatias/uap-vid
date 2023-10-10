'use client'
import { Button } from '@elements/button'
import { notifications } from '@mantine/notifications'
import { approveAnualBudget } from '@repositories/anual-budget'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { Check, X } from 'tabler-icons-react'

export function ApproveAnualBudget({ id }: { id: string }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    return (
        <Button
            loading={isPending}
            intent="secondary"
            className="whitespace-nowrap"
            onClick={async () => {
                const res = await approveAnualBudget(id)
                if (!res)
                    return notifications.show({
                        title: 'Error al aprobar',
                        message:
                            'Ocurrió un error al aprobar el presupuesto, intente de nuevo',
                        color: 'red',
                        icon: <X />,
                        radius: 0,
                        style: {
                            marginBottom: '.8rem',
                        },
                    })
                if (res)
                    notifications.show({
                        title: 'Presupuesto aprobado',
                        message: 'El presupuesto fue aprobado con éxito',
                        color: 'teal',
                        icon: <Check />,
                        radius: 0,
                        style: {
                            marginBottom: '.8rem',
                        },
                    })
                startTransition(() => router.refresh())
            }}
        >
            Aprobar presupuesto
        </Button>
    )
}
