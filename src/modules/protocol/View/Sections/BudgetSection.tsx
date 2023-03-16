import { ProtocolSectionsBudget } from '@prisma/client'
import TableData from '@protocol/elements/TableData/TableData'
import React from 'react'
import SectionLayout from './SectionLayout'

interface BudgetSectionProps {
    data: ProtocolSectionsBudget
}

const BudgetSection = ({ data }: BudgetSectionProps) => {
    const tableData = {
        title: 'Presupuesto',
        values: data.expenses.reduce((newVal: any, item) => {
            newVal.push({
                left: {
                    up: item.type,
                    down: `$${item.amount}`,
                },
                right: {
                    up: item.year,
                    down: item.detail,
                },
            })
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
