import { Badge } from '@components/badge'
import type { User } from '@prisma/client'
import ProtocolStatesDictionary from '@utils/dictionaries/ProtocolStatesDictionary'
import { dateFormatter } from '@utils/formatters'
import { Calendar, User as UserIcon } from 'tabler-icons-react'
import { getAllOwners } from '@repositories/user'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import { getProtocolMetadata } from '@repositories/protocol'
import ProtocolNumberUpdate from '@protocol/elements/protocol-number-update'
import { Heading, Subheading } from '@components/heading'
import { Text } from '@components/text'
import { Divider } from '@components/divider'
import Info from 'modules/info'
import Clipboard from '@elements/clipboard'

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
      <Info
        title="Estado del protocolo"
        content={
          <div className="flex flex-col gap-2">
            <div className="flex flex-col">
              <Badge className="w-fit whitespace-nowrap">
                {ProtocolStatesDictionary.DRAFT}
              </Badge>
              <Text className="flex-1">Protocolo con datos incompletos</Text>
            </div>
            <div className="flex flex-col ">
              <Badge className="w-fit whitespace-nowrap">
                {ProtocolStatesDictionary.PUBLISHED}
              </Badge>
              <Text className="flex-1">
                Protocolo completo que fue publicado para su evaluación
              </Text>
            </div>
            <div className="flex flex-col">
              <Badge className="w-fit whitespace-nowrap">
                {ProtocolStatesDictionary.METHODOLOGICAL_EVALUATION}
              </Badge>
              <Text className="flex-1">
                Se le asignó un evaluador metodológico al protocolo y está en
                proceso de evaluación
              </Text>
            </div>
            <div className="flex flex-col ">
              <Badge className="w-fit whitespace-nowrap">
                {ProtocolStatesDictionary.SCIENTIFIC_EVALUATION}
              </Badge>
              <Text className="flex-1">
                Se le asignó un evaluador científico al protocolo y está en
                proceso de evaluación
              </Text>
            </div>
            <div className="flex flex-col">
              <Badge className="w-fit whitespace-nowrap">
                {ProtocolStatesDictionary.ACCEPTED}
              </Badge>
              <Text className="flex-1">
                El protocolo ha pasado las evaluaciones correspondientes y queda
                a la espera de la aprobación del presupuesto
              </Text>
            </div>
            <div className="flex flex-col">
              <Badge className="w-fit whitespace-nowrap">
                {ProtocolStatesDictionary.ON_GOING}
              </Badge>
              <Text className="flex-1">
                Se aprobó el presupuesto del protocolo y el proyecto de
                investigación está en marcha
              </Text>
            </div>
          </div>
        }
      >
        <Badge className="w-fit !text-[14px] font-semibold">
          {ProtocolStatesDictionary[protocol.state]}
        </Badge>
      </Info>
      <Info content="Convocatoria a la que pertenece el protocolo">
        <Badge className="w-fit !text-[14px] font-semibold">
          {protocol.convocatory ?
            protocol.convocatory.name
          : 'Sin convocatoria'}
        </Badge>
      </Info>

      {/* <FlagsDialog
            protocolId={protocol.id}
            protocolFlags={protocol.flags}
          /> */}
      <Info content="Fecha en la que se creó el protocolo de investigación">
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 text-gray-600" />
          <Text className="font-medium text-gray-600">
            {dateFormatter.format(protocol.createdAt!)}
          </Text>
        </div>
      </Info>

      <div className="flex items-baseline gap-4">
        <div className="flex items-center gap-2">
          <UserIcon data-slot="icon" className="h-4 text-gray-600" />
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <Info content="Usuario que creó el protocolo">
                <Subheading>{protocol.researcher.name}</Subheading>
                <Text className="-mt-1.5 ml-px flex gap-2 text-xs font-light">
                  {protocol.researcher.email}
                </Text>
              </Info>
            </div>
            <Clipboard content={protocol.researcher.email} />
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
