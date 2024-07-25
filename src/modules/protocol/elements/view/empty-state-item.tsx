import { Badge } from '@components/badge'

export function EmptyStateItem({ isOptional }: { isOptional?: true }) {
    return (
        <Badge className=" h-8 bg-gray-200">
            {isOptional ? 'Sin elementos cargados' : 'FALTA COMPLETAR'}
        </Badge>
    )
}
