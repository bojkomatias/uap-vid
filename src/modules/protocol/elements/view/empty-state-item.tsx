import { Badge } from '@components/badge'

export function EmptyStateItem({ isOptional }: { isOptional?: true }) {
  return (
    <Badge
      color={isOptional ? 'light' : 'red'}
      className=" my-auto h-8 w-fit bg-gray-200"
    >
      {isOptional ? 'Sin elementos cargados' : 'Falta completar'}
    </Badge>
  )
}
