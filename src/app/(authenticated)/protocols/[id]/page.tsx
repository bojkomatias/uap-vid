import View from '@protocol/protocol-view-template'
import { redirect } from 'next/navigation'
import { findProtocolById } from 'repositories/protocol'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/[...nextauth]/route'
import { PDF } from 'modules/pdf'

export default async function Page({ params }: { params: { id: string } }) {
    if (params.id === 'new') return redirect('/protocols/new/0')
    const session = await getServerSession(authOptions)
    if (!session) return
    const protocol = await findProtocolById(params.id)
    if (!protocol) {
        return redirect('/protocols')
    }

    return (
        <>
            <pre>{JSON.stringify(protocol.observations, null, 2)}</pre>
            <PDF protocol={protocol} />
            <View sections={protocol.sections} role={session.user.role} />
        </>
    )
}
