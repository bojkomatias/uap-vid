import View from '@protocol/View'
import { findProtocolById } from 'repositories/protocol'

export default async function Page({ params }: { params: { id: string } }) {
    const protocol = await findProtocolById(params.id, false)

    return <View protocol={protocol!} />
}
