import { Badge } from '@components/badge'
import { ProtocolState, type User } from '@prisma/client'
import {
  ProtocolStatesColorDictionary,
  ProtocolStatesDictionary,
} from '@utils/dictionaries/ProtocolStatesDictionary'
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
import FlagsDialog from './flags/flags-dialog'
import { ResearcherReassignation } from './action-buttons/researcher-reassignation'
import { ContainerAnimations } from '../../elements/container-animations'

export async function ProtocolMetadata({
  params,
  actions,
  review_disclose_button
}: {
  params: { id: string }
  actions: any
  review_disclose_button: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  const protocol = await getProtocolMetadata(params.id)
  if (!session || !protocol) return
  let researcherList: User[] = []
  if (session.user.role === 'ADMIN') {
    researcherList = await getAllOwners()
  }

  return (
    <div className="-top-6 z-50" id="metadata-container">
      <ContainerAnimations animation={3}>
        <div className="mt-2 flex w-full flex-col gap-2 rounded-lg bg-gray-200/75 px-3 py-2 leading-relaxed drop-shadow-sm dark:bg-gray-800/90 print:hidden">
          <div className="flex flex-col justify-between md:flex-row md:items-center">
            <Heading
              className="truncate md:text-clip"
              title={protocol.sections.identification.title}
            >
              {protocol.sections.identification.title}
            </Heading>
            <ProtocolNumberUpdate
              protocolId={params.id}
              protocolNumber={protocol.protocolNumber}
              role={session.user.role}
            />
          </div>
          <Divider />
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <Info
              title="Estado del protocolo"
              content={
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col">
                    <Badge
                      color={ProtocolStatesColorDictionary[ProtocolState.DRAFT]}
                      className="w-fit whitespace-nowrap"
                    >
                      {ProtocolStatesDictionary.DRAFT}
                    </Badge>
                    <Text className="flex-1">
                      Protocolo con datos incompletos
                    </Text>
                  </div>
                  <div className="flex flex-col ">
                    <Badge
                      color={
                        ProtocolStatesColorDictionary[ProtocolState.PUBLISHED]
                      }
                      className="w-fit whitespace-nowrap"
                    >
                      {ProtocolStatesDictionary.PUBLISHED}
                    </Badge>
                    <Text className="flex-1">
                      Protocolo completo que fue publicado para su evaluación
                    </Text>
                  </div>
                  <div className="flex flex-col">
                    <Badge
                      color={
                        ProtocolStatesColorDictionary[
                          ProtocolState.METHODOLOGICAL_EVALUATION
                        ]
                      }
                      className="w-fit whitespace-nowrap"
                    >
                      {ProtocolStatesDictionary.METHODOLOGICAL_EVALUATION}
                    </Badge>
                    <Text className="flex-1">
                      Se le asignó un evaluador metodológico al protocolo y está
                      en proceso de evaluación
                    </Text>
                  </div>
                  <div className="flex flex-col ">
                    <Badge
                      color={
                        ProtocolStatesColorDictionary[
                          ProtocolState.SCIENTIFIC_EVALUATION
                        ]
                      }
                      className="w-fit whitespace-nowrap"
                    >
                      {ProtocolStatesDictionary.SCIENTIFIC_EVALUATION}
                    </Badge>
                    <Text className="flex-1">
                      Se le asignó un evaluador científico al protocolo y está
                      en proceso de evaluación
                    </Text>
                  </div>
                  <div className="flex flex-col">
                    <Badge
                      color={
                        ProtocolStatesColorDictionary[ProtocolState.ACCEPTED]
                      }
                      className="w-fit whitespace-nowrap"
                    >
                      {ProtocolStatesDictionary.ACCEPTED}
                    </Badge>
                    <Text className="flex-1">
                      El protocolo ha pasado las evaluaciones correspondientes y
                      queda a la espera de la aprobación del presupuesto
                    </Text>
                  </div>
                  <div className="flex flex-col">
                    <Badge
                      color={
                        ProtocolStatesColorDictionary[ProtocolState.ON_GOING]
                      }
                      className="w-fit whitespace-nowrap"
                    >
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
              <Badge
                color={ProtocolStatesColorDictionary[protocol.state]}
                className="w-fit !text-[14px] font-semibold"
              >
                {ProtocolStatesDictionary[protocol.state]}
              </Badge>
            </Info>
            <Info content="Convocatoria a la que pertenece el protocolo">
              <Badge className="w-fit text-clip !text-[14px] font-semibold">
                {protocol.convocatory ?
                  protocol.convocatory.name
                : 'Sin convocatoria'}
              </Badge>
            </Info>

            <Info content="Fecha en la que se creó el protocolo de investigación">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 text-gray-600" />
                <Text className="font-medium text-gray-600">
                  {dateFormatter.format(protocol.createdAt!)}
                </Text>
              </div>
            </Info>
          </div>

          <div className="flex flex-col justify-between gap-3 md:flex-row md:gap-0">
            <div className="flex items-center gap-2">
              <div>{review_disclose_button}</div>
              <UserIcon data-slot="icon" className="size-4 text-gray-500" />
              <div className="flex flex-col">
                <Info
                  title="Usuario que creó el protocolo"
                  content={
                    <div className="mx-3 flex-grow">
                      {session.user.role === 'ADMIN' && (
                        <ResearcherReassignation
                          protocolId={params.id}
                          researcherId={protocol.researcher.id}
                          researchers={researcherList}
                        />
                      )}
                    </div>
                  }
                >
                  <Subheading>{protocol.researcher.name}</Subheading>
                  <Text className="-mt-1.5 ml-px flex gap-2 text-xs font-light">
                    {protocol.researcher.email}
                  </Text>
                </Info>
              </div>
              <Clipboard
                content={protocol.researcher.email}
                notification_message={`Email del investigador/a copiado: ${protocol.researcher.email}`}
              />
            </div>
            <div className="flex gap-2">
              {actions}
              <div>
                <FlagsDialog
                  protocolId={protocol.id}
                  protocolFlags={protocol.flags}
                />
              </div>
            </div>
          </div>
        </div>
      </ContainerAnimations>
    </div>
  )
}
