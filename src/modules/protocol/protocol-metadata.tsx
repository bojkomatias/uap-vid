import { Badge } from '@elements/badge'
import type { State, User } from '@prisma/client'
import ProtocolStatesDictionary from '@utils/dictionaries/ProtocolStatesDictionary'
import { dateFormatter } from '@utils/formatters'
import { Calendar, User as UserIcon } from 'tabler-icons-react'
import { ResearcherReassignation } from './elements/action-buttons/researcher-reassignation'
import { getAllResearchers } from '@repositories/user'

export async function ProtocolMetadata({
    currentUser,
    id,
    createdAt,
    state,
    researcher,
    convocatory,
}: {
    currentUser: User
    id: string
    createdAt: Date
    state: State
    researcher: { id: string; name: string; email: string }
    convocatory: { id: string; name: string }
}) {
    let researcherList: User[] = []
    if (currentUser.role === 'ADMIN') {
        researcherList = await getAllResearchers()
    }
    return (
        <div className="z-10 my-1 ml-2 max-w-4xl flex-grow rounded-lg bg-gray-50/50 px-3 py-2 leading-relaxed drop-shadow-sm">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 text-gray-600" />
                    <div className="mt-0.5 text-xs text-gray-600">
                        {dateFormatter.format(createdAt)}
                    </div>
                </div>
                <Badge>{convocatory.name}</Badge>
            </div>
            <div className="mt-2 flex items-baseline">
                <div className="flex items-center gap-2">
                    <UserIcon className="h-4 text-gray-600" />
                    <div className="font-medium">
                        {researcher.name}
                        <div className="-mt-1.5 ml-px text-xs font-light text-gray-500">
                            {researcher.email}
                        </div>
                    </div>
                </div>
                <div className="mx-3 mt-1 flex-grow">
                    {currentUser.role === 'ADMIN' && (
                        <ResearcherReassignation
                            protocolId={id}
                            researcherId={researcher.id}
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
