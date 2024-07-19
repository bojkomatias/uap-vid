import type { ProtocolSectionsBudget } from '@prisma/client'
import type { ListRowValues } from '@protocol/elements/view/item-list-view'
import ItemListView from '@protocol/elements/view/item-list-view'
import SectionViewer from '../elements/view/section-viewer'
import { currencyFormatter } from '@utils/formatters'
import { Currency } from '@shared/currency'
import { Text } from '@components/text'

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
              down: <Currency amountIndex={item.amountIndex} />,
              inverted: true,
            },
          ])
          return newVal
        }, []),
      }
    }),
  }

  const totalAmountIndex = data.expenses.reduce(
    (acc, current) => {
      const reduceFCA =
        acc.FCA + current.data.reduce((a, c) => a + c.amountIndex.FCA, 0)
      const reduceFMR =
        acc.FMR + current.data.reduce((a, c) => a + c.amountIndex.FMR, 0)
      return { FCA: reduceFCA, FMR: reduceFMR }
    },
    { FCA: 0, FMR: 0 }
  )

  return (
    <SectionViewer title="Presupuesto" description="Detalles del presupuesto">
      <ItemListView
        data={tableData}
        footer={
          <Text className="col-span-full ml-auto !text-base/6">
            Total: <Currency amountIndex={totalAmountIndex} />
          </Text>
        }
      />
    </SectionViewer>
  )
}

export default BudgetView
