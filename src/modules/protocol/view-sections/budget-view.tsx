import type { ProtocolSectionsBudget } from '@prisma/client'
import type { ListRowValues } from '@protocol/elements/item-list-view'
import ItemListView from '@protocol/elements/item-list-view'
import SectionViewer from '../elements/section-viewer'

interface BudgetViewProps {
    data: ProtocolSectionsBudget
}

const BudgetView = ({ data }: BudgetViewProps) => {
    const tableData = {
        title: 'Presupuesto de gastos directos',
        deepValues: data.expenses.map((item) => {
            return {
                groupLabel: item.type,
                data: item.data.reduce((newVal: ListRowValues[], item) => {
                    newVal.push([
                        {
                            up: 'Detalle',
                            down: item.detail,
                            inverted: true,
                        },
                        {
                            up: 'Monto',
                            down: `$${item.amount}`.replace(
                                /\B(?=(\d{3})+(?!\d))/g,
                                '.'
                            ),
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
        }),
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
