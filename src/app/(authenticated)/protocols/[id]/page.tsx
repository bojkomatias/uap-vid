import View from '@protocol/protocol-view-template'
import { redirect } from 'next/navigation'
import { findProtocolById } from 'repositories/protocol'
import { PDF } from 'modules/pdf'

export default async function Page({ params }: { params: { id: string } }) {
    if (params.id === 'new') redirect('/protocols/new/0')
    const protocol = await findProtocolById(params.id)
    if (!protocol) {
        redirect('/protocols')
    }

    console.log(protocol.anualBudgets)

    return (
        <>
            <PDF protocol={protocol} />
            <View sections={protocol.sections} />
        </>
    )
}
