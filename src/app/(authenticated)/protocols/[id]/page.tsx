import View from '@protocol/protocol-view-template'
import { redirect } from 'next/navigation'
import { findProtocolById } from 'repositories/protocol'
import { PDF } from 'modules/protocol-pdf'

export default async function Page({ params }: { params: { id: string } }) {
    if (params.id === 'new') redirect('/protocols/new/0')
    const protocol = await findProtocolById(params.id)
    if (!protocol) {
        redirect('/protocols')
    }

    return (
        <>
            <PDF />
            <View sections={protocol.sections} />
        </>
    )
}
