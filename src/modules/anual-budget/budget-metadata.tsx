import { Badge } from '@components/badge'
import type { AnualBudget } from '@prisma/client'
import AnualBudgetStateDictionary from '@utils/dictionaries/AnualBudgetStateDictionary'
import { dateFormatter } from '@utils/formatters'

export const BudgetMetadata = ({
  title,
  sponsor,
  createdAt,
  updatedAt,
  state,
}: Omit<AnualBudget, 'budgetItems'> & {
  title: string
  sponsor: string[]
}) => {
  return (
    <div className="w-full max-w-3xl rounded-lg bg-gray-50 p-4 text-xs leading-loose">
      <div className="flex items-baseline">
        <div className="flex-grow">
          <span className="pr-2 font-medium underline underline-offset-2">
            Creado:
          </span>
          {dateFormatter.format(createdAt)}
          <span className="ml-4 pr-2 font-medium underline underline-offset-2">
            Última edición:
          </span>
          {dateFormatter.format(updatedAt)}
        </div>
        <Badge>{AnualBudgetStateDictionary[state]}</Badge>
      </div>
      <span className="pr-2 font-medium underline underline-offset-2">
        Protocolo:
      </span>
      {title}
      <br />
      <span className="pr-2 font-medium underline underline-offset-2">
        Ente patrocinante:
      </span>
      {sponsor.join(', ')}
    </div>
  )
}
