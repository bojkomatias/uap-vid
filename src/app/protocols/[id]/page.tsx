import View from '@protocol/View'
import { findProtocolById } from 'repositories/protocol'

export default async function Page({ params }: { params: { id: string } }) {
    if (params.id === 'new') return <></>
    const protocol = await findProtocolById(params.id, false)

    return <View protocol={protocol!} />
}
