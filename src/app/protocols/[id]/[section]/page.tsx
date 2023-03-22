import ProtocolForm from '@protocol/Form'
import { canExecute } from '@utils/scopes'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { findProtocolById } from 'repositories/protocol'

export default async function Page({
    params,
}: {
    params: { id: string; section: string }
}) {
    const protocol = await findProtocolById(params.id)
    const session = await getServerSession(authOptions)
    if (!protocol) redirect('/protocols')
    if (!canExecute('EDIT', session?.user?.role!, protocol?.state!))
        redirect('/protocols')

    return (
        <ProtocolForm
            protocol={{
                id: protocol.id,
                createdAt: protocol.createdAt,
                researcher: protocol.researcher,
                state: protocol.state,
                sections: protocol.sections,
            }}
        />
    )
}
