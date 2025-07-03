import type { ProtocolSectionsBudget } from '@prisma/client'
import SectionViewer from '../elements/view/section-viewer'
import { Currency } from '@shared/currency'
import { Text } from '@components/text'
import {
  DescriptionDetails,
  DescriptionTerm,
} from '@components/description-list'

interface BudgetViewProps {
  data: ProtocolSectionsBudget
}

// Custom Budget Table Component
const BudgetTable = ({ data }: { data: ProtocolSectionsBudget }) => {
  // Filter out expense types that don't have any real data
  const expensesWithData = data.expenses.filter(
    (expenseType) => expenseType.data && expenseType.data.length > 0
  )

  const totalAmountIndex = expensesWithData.reduce(
    (acc, current) => {
      const reduceFCA =
        acc.FCA + current.data.reduce((a, c) => a + c.amountIndex.FCA, 0)
      const reduceFMR =
        acc.FMR + current.data.reduce((a, c) => a + c.amountIndex.FMR, 0)
      return { FCA: reduceFCA, FMR: reduceFMR }
    },
    { FCA: 0, FMR: 0 }
  )

  // If no expenses have data, show empty state
  if (expensesWithData.length === 0) {
    return (
      <>
        <DescriptionTerm>Presupuesto de gastos directos</DescriptionTerm>
        <DescriptionDetails>
          <Text className="text-left italic !text-black">
            No se han definido gastos para este proyecto.
          </Text>
        </DescriptionDetails>
      </>
    )
  }

  return (
    <>
      <DescriptionTerm>Presupuesto de gastos directos</DescriptionTerm>
      <DescriptionDetails>
        <div className="space-y-4">
          {expensesWithData.map((expenseType, typeIndex) => (
            <div key={typeIndex} className="space-y-2">
              {/* Expense Type Header */}
              <Text className="border-b border-gray-100 pb-1 text-left font-medium">
                {expenseType.type}
              </Text>

              {/* Table Header */}
              <div className="grid grid-cols-3 gap-4 border-b border-gray-100 pb-2">
                <Text className="text-left">Detalle</Text>
                <Text className="text-left">Año</Text>
                <Text className="text-left">Monto</Text>
              </div>

              {/* Expense Items */}
              {expenseType.data.map((item, itemIndex) => (
                <div key={itemIndex} className="grid grid-cols-3 gap-4 py-1">
                  <Text className="text-left !text-black">{item.detail}</Text>
                  <Text className="text-left !text-black">{item.year}</Text>
                  <Text className="text-left !text-black">
                    <Currency amountIndex={item.amountIndex} />
                  </Text>
                </div>
              ))}
            </div>
          ))}

          {/* Total */}
          {totalAmountIndex.FCA > 0 && (
            <div className="mt-4 border-t border-gray-100 pt-2">
              <Text className="text-right !text-black">
                Total: <Currency amountIndex={totalAmountIndex} />
              </Text>
            </div>
          )}
        </div>
      </DescriptionDetails>
    </>
  )
}

const BudgetView = ({ data }: BudgetViewProps) => {
  return (
    <SectionViewer title="Presupuesto" description="Detalles del presupuesto">
      <BudgetTable data={data} />
    </SectionViewer>
  )
}

export default BudgetView
