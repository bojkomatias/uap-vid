import type { ProtocolSectionsBudget } from '@prisma/client'
import ItemListView from '@protocol/elements/item-list-view'
import SectionViewer from '../elements/section-viewer'

interface BudgetViewProps {
    data: ProtocolSectionsBudget
}

const BudgetView = ({ data }: BudgetViewProps) => {
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
                    down: item.year,
                    inverted: true,
                },
            ])
            return newVal
        }, []),
    }

    return (
        <SectionViewer
            title="Presupuesto"
            description="Detalles del presupuesto"
        >
            <ItemListView data={tableData} />
        </SectionViewer>
    )
}

export default BudgetView
