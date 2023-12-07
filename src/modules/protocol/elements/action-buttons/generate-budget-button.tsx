'use client'
import { FileDollar } from 'tabler-icons-react'
import { Button } from '@elements/button'
import InfoTooltip from '../tooltip'
import { useRouter } from 'next/navigation'

export function GenerateAnualBudgetButton({
    budget_years_check,
}: {
    budget_years_check: boolean
}) {
    const router = useRouter()
    return budget_years_check ? (
        <div className="relative w-fit">
            <div className="absolute inset-0 z-[10] mr-3">
                <InfoTooltip>
                    <h4>
                        El protocolo ya tiene generado un presupuesto en el
                        corriente año.
                    </h4>
                </InfoTooltip>
            </div>
            <Button intent={'secondary'} disabled={budget_years_check}>
                <FileDollar className="h-4 w-4 text-current" />
                Generar presupuesto
                <div className="w-4" />
            </Button>
        </div>
    ) : (
        <Button
            intent="secondary"
            onClick={() => {
                router.refresh()
                router.push('/generate-budget', { scroll: false })
            }}
        >
            <FileDollar className="h-4 w-4 text-current" />
            Generar presupuesto
        </Button>
    )
}
