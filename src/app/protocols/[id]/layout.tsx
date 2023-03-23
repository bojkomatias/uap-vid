import { Heading } from '@layout/Heading'
import ReviewWrapper from '@review/Container'
import { canAccess, canExecute } from '@utils/scopes'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { ReactNode } from 'react'
import { findProtocolById } from 'repositories/protocol'
import { redirect } from 'next/navigation'
import PublishButton from '@protocol/elements/action-buttons/Publish'
import EditButton from '@protocol/elements/action-buttons/Edit'

async function Layout({
    params,
    children,
}: {
    params: { id: string }
    children: ReactNode
}) {
    const session = await getServerSession(authOptions)
    const protocol = await findProtocolById(params.id)
    if (!protocol) redirect('/protocols')

    //* PROPONGO QUE LA MAYORÍA LOS BOTONES DE ACCIÓN DE LOS PROTOCOLOS ESTÉN ACA Y JUNTOS
    return (
        <>
            <Heading
                title={
                    <span>
                        Protocolo:{' '}
                        <span className="font-light">
                            {protocol.sections.identification.title}
                        </span>
                    </span>
                }
            />
            <div className="justify-end flex items-center mr-3 gap-2 mt-1">
                <PublishButton
                    role={session?.user?.role!}
                    protocol={protocol}
                />
                <EditButton
                    role={session?.user?.role!}
                    state={protocol.state}
                    id={protocol.id}
                />
            </div>
            <div className="flex w-full">
                <div className="max-w-7xl mx-auto w-full">{children}</div>
                <ReviewWrapper protocol={protocol} user={session?.user!} />
            </div>
        </>
    )
}

export default Layout
