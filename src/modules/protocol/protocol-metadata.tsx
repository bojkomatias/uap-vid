import { Badge } from '@elements/badge'
import { Button } from '@elements/button'
import { Prisma, State } from '@prisma/client'
import ProtocolStatesDictionary from '@utils/dictionaries/ProtocolStatesDictionary'
import { dateFormatter } from '@utils/formatters'
import { Calendar, User } from 'tabler-icons-react'

type User = Prisma.UserGetPayload<{
    select: { id: true; name: true; email: true }
}>
type Convocatory = Prisma.ConvocatoryGetPayload<{
    select: { id: true; name: true }
}>

export function ProtocolMetadata({
    id,
    createdAt,
    state,
    researcher,
    convocatory,
}: {
    id: string
    createdAt: Date
    state: State
    researcher: User
    convocatory: Convocatory
}) {
    return (
        <div className="ml-2 mt-1 max-w-2xl rounded-lg bg-gray-50/50 px-3 py-2 leading-loose drop-shadow-sm">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 text-gray-600" />
                    <div className="mt-1 text-xs text-gray-600">
                        {dateFormatter.format(createdAt)}
                    </div>
                </div>
                <Badge>{convocatory.name}</Badge>
            </div>
            <div className="mt-1 flex items-center">
                <div className="flex items-baseline gap-2">
                    <User className="h-4 text-gray-600" />
                    <span className="font-medium">{researcher.name}</span>
                    <span className="text-xs text-gray-600">
                        {researcher.email}
                    </span>
                </div>
                <div className="mx-2 -mt-px flex-grow">
                    <Button intent="outline" className="px-2 py-1 text-xs">
                        Re-asignar investigador
                    </Button>
                </div>
                <Badge className="text-sm">
                    {ProtocolStatesDictionary[state]}
                </Badge>
            </div>
        </div>
    )
}
