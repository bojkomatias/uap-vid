import { Heading } from '@layout/Heading'
import { canExecute } from '@utils/scopes'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { ReactNode } from 'react'
import { findProtocolById } from 'repositories/protocol'
import { redirect } from 'next/navigation'
import PublishButton from '@protocol/elements/action-buttons/Publish'
import EditButton from '@protocol/elements/action-buttons/Edit'
import Reviews from '@review/Container'

async function Layout({
    params,
    children,
}: {
    params: { id: string }
    children: ReactNode
}) {
    const session = await getServerSession(authOptions)
    if (params.id === 'new') {
        if (!canExecute('CREATE', session?.user?.role!, 'NOT_CREATED'))
            redirect('/protocols')
        return (
            <>
                <Heading title={'Nuevo protocolo'} />
                <div className="max-w-7xl mx-auto w-full">{children}</div>
            </>
        )
    }
    const protocol = await findProtocolById(params.id, true)
    if (!protocol) redirect('/protocols')

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
                <Reviews protocol={protocol} user={session?.user!} />
            </div>
        </>
    )
}

export default Layout
