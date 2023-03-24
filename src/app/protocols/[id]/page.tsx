import View from '@protocol/View'
import { redirect } from 'next/navigation'
import { findProtocolById } from 'repositories/protocol'

export default async function Page({ params }: { params: { id: string } }) {
    if (params.id === 'new') return redirect('/protocols/new/0')
    const protocol = await findProtocolById(params.id, false)

    return <View protocol={protocol!} />
}
