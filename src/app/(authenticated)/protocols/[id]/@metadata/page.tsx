import { Badge } from '@components/badge'
import type { User } from '@prisma/client'
import ProtocolStatesDictionary from '@utils/dictionaries/ProtocolStatesDictionary'
import { dateFormatter } from '@utils/formatters'
import { Calendar, User as UserIcon } from 'tabler-icons-react'
import { getAllOwners } from '@repositories/user'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import { getProtocolMetadata } from '@repositories/protocol'
import { ResearcherReassignation } from '@protocol/elements/action-buttons/researcher-reassignation'
import ProtocolNumberUpdate from '@protocol/elements/protocol-number-update'
import FlagsDropdown from '@protocol/elements/flags/flags-dropdown'

export default async function ProtocolMetadata({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)
  const protocol = await getProtocolMetadata(params.id)
  if (!session || !protocol) return
  let researcherList: User[] = []
  if (session.user.role === 'ADMIN') {
    researcherList = await getAllOwners()
  }

  return (
    <div className="relative z-20 my-1 ml-2 max-w-3xl flex-grow gap-2 rounded-lg bg-gray-50/50 px-3 py-2 leading-relaxed drop-shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <ProtocolNumberUpdate
            protocolId={params.id}
            protocolNumber={protocol.protocolNumber}
            role={session.user.role}
          />
          <FlagsDropdown
            protocolId={protocol.id}
            protocolFlags={protocol.flags}
          />

          <span>
            <Calendar className="mr-2 inline h-4 text-gray-600" />
            <span className="mt-0.5 text-xs text-gray-600">
              {dateFormatter.format(protocol.createdAt!)}
            </span>
          </span>
        </div>
        <Badge>
          {protocol.convocatory ?
            protocol.convocatory.name
          : 'Sin convocatoria'}
        </Badge>
      </div>
      <div className="mt-2 flex items-baseline gap-4">
        <div className="flex items-center gap-2">
          <UserIcon className="h-4 text-gray-600" />
          <div className="font-medium">
            {protocol.researcher.name}
            <div className="-mt-1.5 ml-px text-xs font-light text-gray-500">
              {protocol.researcher.email}
            </div>
          </div>
        </div>
        <div className="mx-3 mt-1 flex-grow">
          {session.user.role === 'ADMIN' && (
            <ResearcherReassignation
              protocolId={params.id}
              researcherId={protocol.researcher.id}
              researchers={researcherList}
            />
          )}
        </div>
        <Badge>{ProtocolStatesDictionary[protocol.state]}</Badge>
      </div>
    </div>
  )
}
