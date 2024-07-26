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
import FlagsDialog from '@protocol/elements/flags/flags-dialog'
import { Heading, Subheading } from '@components/heading'
import { Text } from '@components/text'
import { Divider } from '@components/divider'

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
    <div className="sticky -top-6 z-50 mb-8 mt-2 flex w-full flex-col gap-2 rounded-lg bg-gray-200/75 px-3 py-2 leading-relaxed drop-shadow-sm dark:bg-gray-800/90 print:hidden">
      <div className="flex items-center justify-between">
        <Heading title={protocol.sections.identification.title}>
          {protocol.sections.identification.title}
        </Heading>
        <ProtocolNumberUpdate
          protocolId={params.id}
          protocolNumber={protocol.protocolNumber}
          role={session.user.role}
        />
      </div>
      <Divider />
      <Badge className="w-fit">
        {protocol.convocatory ? protocol.convocatory.name : 'Sin convocatoria'}
      </Badge>
      <Badge className="w-fit">
        {ProtocolStatesDictionary[protocol.state]}
      </Badge>

      {/* <FlagsDialog
            protocolId={protocol.id}
            protocolFlags={protocol.flags}
          /> */}
      <div className="flex items-center">
        <Calendar className="mr-2 inline h-4 text-gray-600" />
        <Text className="text-xs text-gray-600">
          {dateFormatter.format(protocol.createdAt!)}
        </Text>
      </div>
      <div className="flex items-baseline gap-4">
        <div className="flex items-center gap-2">
          <UserIcon data-slot="icon" className="h-4 text-gray-600" />
          <div className="flex flex-col">
            <Subheading>{protocol.researcher.name}</Subheading>
            <Text className="-mt-1.5 ml-px text-xs font-light">
              {protocol.researcher.email}
            </Text>
          </div>
        </div>
        {/* <div className="mx-3 mt-1 flex-grow">
          {session.user.role === 'ADMIN' && (
            <ResearcherReassignation
              protocolId={params.id}
              researcherId={protocol.researcher.id}
              researchers={researcherList}
            />
          )}
        </div> */}
      </div>
    </div>
  )
}
