import View from '@protocol/protocol-view-template'
import { redirect } from 'next/navigation'
import { findProtocolById } from 'repositories/protocol'
import { PDF } from 'modules/protocol-pdf'
import ChatFullComponent from 'modules/chat/ChatFullComponent'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/[...nextauth]/auth'

export default async function Page({ params }: { params: { id: string } }) {
    if (params.id === 'new') redirect('/protocols/new/0')
    const protocol = await findProtocolById(params.id)

    if (!protocol) {
        redirect('/protocols')
    }

    const session = await getServerSession(authOptions)

    return (
        <>
            <PDF />
            <ChatFullComponent user={session!.user} protocolId={protocol.id} />
            <View sections={protocol.sections} />
        </>
    )
}
