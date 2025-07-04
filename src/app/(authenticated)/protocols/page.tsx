import ProtocolTable from '@protocol/elements/view/protocol-table'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import { getProtocolsByRole } from 'repositories/protocol'
import { Heading, Subheading } from '@components/heading'
import { Button } from '@components/button'
import { FileReport } from 'tabler-icons-react'
import { ContainerAnimations } from '@elements/container-animations'
import { getAcademicUnitsNameAndShortname } from '@repositories/academic-unit'
import { getActiveCareersForForm } from '@repositories/career'
import React from 'react'
import DownloadTabularData from '@protocol/elements/download-tabular-data'

// SSR Server Component, so no need to fetch from api endpoint
export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) return

  const [totalRecords, protocols] = await getProtocolsByRole(
    session.user.role,
    session.user.id,
    searchParams
  )

  const academicUnits = await getAcademicUnitsNameAndShortname()
  const careers = await getActiveCareersForForm()

  return (
    <>
      <ContainerAnimations duration={0.4} delay={0}>
        <div className="flex">
          <Heading>Lista de proyectos de investigación</Heading>
          <div className="flex items-end gap-2">
            {session.user.role === 'ADMIN' && <DownloadTabularData />}

            {session.user.role !== 'SCIENTIST' && (
              <Button href={'/protocols/new/0'}>
                <FileReport data-slot="icon" /> Nuevo proyecto
              </Button>
            )}

          </div>
        </div>

        <Subheading>
          Lista de todos los protocolos cargados en el sistema, puede clickear
          sobre uno de la lista para ver todos los detalles del protocolo.
        </Subheading>
      </ContainerAnimations>

      <ContainerAnimations duration={0.3} delay={0.1} animation={2}>
        <ProtocolTable
          careers={careers}
          academicUnits={academicUnits}
          user={session.user}
          protocols={protocols}
          totalRecords={totalRecords}
        />
      </ContainerAnimations>
    </>
  )
}
