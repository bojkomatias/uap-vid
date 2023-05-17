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
                            up: 'Año',
                            down: item.year,
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
            <ItemListView data={tableData} footer={<div className='flex gap-2 py-4 ml-auto w-fit text-xl mr-4'><p className='text-gray-400'>Total: </p> ${data.expenses.reduce((acc, val) => {
                        return (
                            acc +
                            val.data.reduce((prev, curr) => {
                                
                                if(isNaN(curr.amount)) curr.amount = 0
                                else curr.amount
                                return prev + curr.amount;
                            }, 0) 
                        )
                    }, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</div>} />
            
        </SectionViewer>
    )
}

export default BudgetView
