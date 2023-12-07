'use client'
import { generateAnualBudget } from '@actions/anual-budget/action'
import MultipleButton from '@elements/multiple-button'
import { notifications } from '@elements/notifications'
import { useRouter } from 'next/navigation'

export function ActionGenerateButton({
    protocolId,
    anualBudgetYears,
}: {
    protocolId: string
    anualBudgetYears: number[]
}) {
    const router = useRouter()
    const currentYear = new Date().getFullYear()
    const options = [
        {
            year: currentYear,
            title: `Generar presupuesto: ${currentYear}`,
            description: 'Genera el presupuesto para el año actual',
            onClick: async () => {
                const budget = await generateAnualBudget(
                    protocolId,
                    currentYear.toString()
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
            },
        },
        {
            year: currentYear + 1,
            title: `Generar presupuesto: ${currentYear + 1}`,
            description: 'Genera el presupuesto para el año entrante',
            onClick: async () => {
                const budget = await generateAnualBudget(
                    protocolId,
                    (currentYear + 1).toString()
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
            },
        },
    ].filter((x) => anualBudgetYears.includes(x.year))
    // The default is the option where it starts next year.
    return (
        <MultipleButton
            position="left-0 absolute bottom-0"
            defaultValue={options[1]}
            options={options}
        />
    )
}
