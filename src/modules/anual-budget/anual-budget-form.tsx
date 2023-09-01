import type { Budget } from '@prisma/client'
import React from 'react'

export default function AnualBudgetForm({
    ProtocolBudget,
}: {
    ProtocolBudget: Budget
}) {
    return <div>{JSON.stringify(ProtocolBudget, null, 2)}</div>
}
