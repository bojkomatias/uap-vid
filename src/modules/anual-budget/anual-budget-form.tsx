import type { AnualBudget } from '@prisma/client'
import React from 'react'

export default function AnualBudgetForm({
    protocolBudget,
}: {
    protocolBudget: AnualBudget
}) {
    return <div>{JSON.stringify(protocolBudget, null, 2)}</div>
}
