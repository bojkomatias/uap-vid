import { Badge } from '@elements/badge'
import type { State, User } from '@prisma/client'
import ProtocolStatesDictionary from '@utils/dictionaries/ProtocolStatesDictionary'
import { dateFormatter } from '@utils/formatters'
import { Calendar, User as UserIcon } from 'tabler-icons-react'
import { ResearcherReassignation } from './elements/action-buttons/researcher-reassignation'
import { getAllOwners } from '@repositories/user'
import ProtocolNumberUpdate from './elements/protocol-number-update'

export async function ProtocolMetadata({
    currentUser,
    id,
    protocolNumber,
    createdAt,
    state,
    researcher,
    convocatory,
}: {
    currentUser: User
    id: string
    protocolNumber: string | null
    createdAt: Date | null
    state: State
    researcher: { id: string; name: string; email: string }
    convocatory: { id: string; name: string }
}) {
    let researcherList: User[] = []
    if (currentUser.role === 'ADMIN') {
        researcherList = await getAllOwners()
    }

    return (
        <div className="z-10 my-1 ml-2 max-w-3xl flex-grow gap-2 rounded-lg bg-gray-50/50 px-3 py-2 leading-relaxed drop-shadow-sm">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                    <ProtocolNumberUpdate
                        protocolId={id}
                        protocolNumber={protocolNumber}
                        role={currentUser.role}
                    />

                    <span>
                        <Calendar className="mr-2 inline h-4 text-gray-600" />
                        <span className="mt-0.5 text-xs text-gray-600">
                            {dateFormatter.format(createdAt!)}
                        </span>
                    </span>
                </div>
                <Badge>{convocatory?.name}</Badge>
            </div>
            <div className="mt-2 flex items-baseline gap-4">
                <div className="flex items-center gap-2">
                    <UserIcon className="h-4 text-gray-600" />
                    <div className="font-medium">
                        {researcher?.name}
                        <div className="-mt-1.5 ml-px text-xs font-light text-gray-500">
                            {researcher?.email}
                        </div>
                    </div>
                </div>
                <div className="mx-3 mt-1 flex-grow">
                    {currentUser.role === 'ADMIN' && (
                        <ResearcherReassignation
                            protocolId={id}
                            researcherId={researcher?.id}
                            researchers={researcherList}
                        />
                    )}
                </div>
                <Badge className="text-sm">
                    {ProtocolStatesDictionary[state]}
                </Badge>
            </div>
        </div>
    )
}
