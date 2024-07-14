import ProtocolTable from '@protocol/elements/view/protocol-table'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import { getProtocolsByRol } from 'repositories/protocol'
import { canExecute } from '@utils/scopes'
import { Action, ProtocolState } from '@prisma/client'
import { Heading, Subheading } from '@components/heading'
import { Button } from '@components/button'
import { FileReport } from 'tabler-icons-react'

// SSR Server Component, so no need to fetch from api endpoint
export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) return

  const [totalRecords, protocols] = await getProtocolsByRol(
    session.user.role,
    session.user.id,
    searchParams
  )

  return (
    <>
      <div className="flex items-end">
        <Heading>Lista de proyectos de investigación</Heading>
        {canExecute(
          Action.CREATE,
          session.user.role,
          ProtocolState.NOT_CREATED
        ) && (
          <Button href={'/protocols/new/0'}>
            <FileReport data-slot="icon" /> Nuevo proyecto
          </Button>
        )}
      </div>
      <Subheading>
        Lista de todos los protocolos cargados en el sistema, haz click en
        &apos;ver&apos; para ver todos los detalles del protocolo.
      </Subheading>

      <ProtocolTable
        user={session.user}
        protocols={protocols}
        totalRecords={totalRecords}
      />
    </>
  )
}
