'use client'

import { generateAnualBudget } from '@actions/anual-budget/action'
import { Button } from '@elements/button'
import { notifications } from '@elements/notifications'
import { useRouter } from 'next/navigation'

export function ActionGenerateButton({ protocolId }: { protocolId: string }) {
    const router = useRouter()
    const currentYear = new Date().getFullYear().toString()

    return (
        <Button
            intent="secondary"
            onClick={async () => {
                notifications.show({
                    title: 'Presupuesto generado',
                    message: 'Se generó correctamente el presupuesto',
                    intent: 'success',
                })
                const budget = await generateAnualBudget(
                    protocolId,
                    currentYear
                )

                if (budget) {
                    notifications.show({
                        title: 'Presupuesto generado',
                        message: 'Se generó correctamente el presupuesto',
                        intent: 'success',
                    })
                    setTimeout(() => {
                        router.push(`anual-budgets/budget/${budget}`)
                    }, 500)
                } else
                    notifications.show({
                        title: 'Problema al generar presupuesto',
                        message: 'Ocurrió un error al generar el presupuesto',
                        intent: 'error',
                    })
            }}
        >
            Generar presupuesto
        </Button>
    )
}
