'use client'
import { FileDollar } from 'tabler-icons-react'
import { Button } from '@elements/button'
import { useRouter } from 'next/navigation'

export function GenerateAnualBudgetButton({
    protocolId,
}: {
    protocolId: string
}) {
    const router = useRouter()
    return (
        <Button
            intent="secondary"
            onClick={() => {
                router.push(`/generate-budget/${protocolId}`, {
                    scroll: false,
                })
            }}
        >
            <FileDollar className="h-4 w-4 text-current" />
            Generar presupuesto
        </Button>
    )
}
