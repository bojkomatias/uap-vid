import { Heading } from '@layout/c-heading'
import { canExecute } from '@utils/scopes'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { ReactNode } from 'react'
import { findProtocolById } from 'repositories/protocol'
import { redirect } from 'next/navigation'
import Reviews from '@review/index'

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
                <div className="mx-auto w-full max-w-7xl">{children}</div>
            </>
        )
    }
    const protocol = await findProtocolById(params.id)
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

            <div className="flex flex-col-reverse lg:flex-row">
                <div className="mx-auto w-full max-w-7xl">{children}</div>
                {/* @ts-expect-error Server Component */}
                <Reviews protocol={protocol} user={session?.user!} />
            </div>
        </>
    )
}

export default Layout
