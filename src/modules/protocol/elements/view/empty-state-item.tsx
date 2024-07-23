import { Badge } from '@components/badge'
import { DescriptionDetails } from '@components/description-list'

export function EmptyStateItem({ isOptional }: { isOptional?: true }) {
  return (
    <Badge className="flex h-8 w-full justify-center bg-gray-500/5">
      {isOptional ? 'Sin elementos cargados' : 'FALTA COMPLETAR'}
    </Badge>
  )
}
