import { PageHeading } from '@layout/page-heading'
import CreateButton from '@protocol/elements/action-buttons/create'
import ProtocolTable from '@protocol/elements/protocol-table'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/[...nextauth]/route'
import { getProtocolsByRol } from 'repositories/protocol'
import { canExecute } from '@utils/scopes'
import { ACTION } from '@utils/zod'

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
            <PageHeading title="Lista de proyectos de investigación" />
            <p className="mt-2 text-sm text-gray-500">
                Lista de todos los protocolos cargados en el sistema, haz click
                en &apos;ver&apos; para más detalles.
            </p>

            <div className="mt-3 flex justify-end">
                {canExecute(
                    ACTION.CREATE,
                    session.user.role,
                    'NOT_CREATED'
                ) && <CreateButton role={session.user.role} />}
            </div>

            <ProtocolTable
                user={session.user}
                protocols={protocols}
                totalRecords={totalRecords}
            />
        </>
    )
}
