import { ProtocolSectionsBudget } from '@prisma/client'
import TableData from '@protocol/elements/TableData/TableData'
import React from 'react'
import SectionLayout from './SectionLayout'

interface BudgetSectionProps {
    data: ProtocolSectionsBudget
}

const BudgetSection = ({ data }: BudgetSectionProps) => {
    const tableData = {
        title: 'Presupuesto de gastos directos',
        values: data.expenses.reduce((newVal: any, item) => {
            newVal.push([
                {
                    up: item.type,
                    down: item.detail,
                },
                {
                    up: 'Monto',
                    down: `$${item.amount}`,
                    inverted: true,
                },
                {
                    up: 'Año',
                    down: item.detail,
                    inverted: true,
                },
            ])
            return newVal
        }, []),
    }

    return (
        <SectionLayout
            title="Presupuesto"
            description="Detalles del presupuesto"
        >
            <TableData data={tableData} />
        </SectionLayout>
    )
}

export default BudgetSection
