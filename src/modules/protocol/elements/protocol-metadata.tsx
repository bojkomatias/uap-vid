import { Badge } from '@components/badge'
import { ProtocolState } from '@prisma/client'
import {
  ProtocolStatesColorDictionary,
  ProtocolStatesDictionary,
} from '@utils/dictionaries/ProtocolStatesDictionary'
import { dateFormatter } from '@utils/formatters'
import { Calendar } from 'tabler-icons-react'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import { getProtocolMetadata } from '@repositories/protocol'
import ProtocolNumberUpdate from '@protocol/elements/protocol-number-update'
import { Heading } from '@components/heading'
import { Text } from '@components/text'
import { Divider } from '@components/divider'
import Info from 'modules/info'
import { ContainerAnimations } from '../../elements/container-animations'
import type { ReactNode } from 'react'
import { Researcher } from './researcher'
import { AssingConvocatoryDialog } from './assign-convocatory-dialog'

export async function ProtocolMetadata({
  params,
  evaluators,
  actions,
  review_disclose_button,
}: {
  params: { id: string }
  actions: any
  review_disclose_button: React.ReactNode
  evaluators: ReactNode
}) {
  const session = await getServerSession(authOptions)
  const protocol = await getProtocolMetadata(params.id)
  if (!session || !protocol) return

  return (
    <div className="-top-6 z-50" id="metadata-container">
      <ContainerAnimations animation={3}>
        <div className="mt-2 flex w-full flex-col gap-2 rounded-lg bg-gray-200/75 px-3 py-2 leading-relaxed drop-shadow-sm dark:bg-gray-800/90 print:hidden">
          <div className="flex flex-col justify-between md:flex-row md:items-center">
            <Heading
              className="truncate md:text-ellipsis"
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
                className="!text-sm/6 font-semibold"
              >
                {ProtocolStatesDictionary[protocol.state]}
              </Badge>
            </Info>
            {session.user.role === 'ADMIN' ?
              <AssingConvocatoryDialog
                protocolId={protocol.id}
                convocatory={protocol.convocatory}
              />
            : <Info content="Convocatoria a la que pertenece el protocolo">
                <Badge className="w-fit text-clip !text-sm/6 font-semibold">
                  {protocol.convocatory ?
                    protocol.convocatory.name
                  : 'Sin convocatoria'}
                </Badge>
              </Info>
            }

            <Info content="Fecha en la que se creó el protocolo de investigación">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 text-gray-600" />
                <Text className="font-medium text-gray-600">
                  {dateFormatter.format(protocol.createdAt!)}
                </Text>
              </div>
            </Info>
          </div>

          <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-center md:gap-1">
            {/* Researcher */}
            {review_disclose_button}
            <Researcher
              researcher={protocol.researcher}
              protocolId={protocol.id}
              isAdmin={session.user.role === 'ADMIN'}
            />
            <span className="grow" />
            {/* Evaluators */}
            {evaluators}
            {actions}
          </div>
        </div>
      </ContainerAnimations>
    </div>
  )
}
