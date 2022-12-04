import Heading from '@layout/Heading'
import ProtocolForm from '@protocol/ProtocolForm'
import { findProtocolById } from 'repositories/protocol'

export default async function Page({
    params,
    searchParams,
}: {
    params: { id: string }
    searchParams: any
}) {
    const protocol = await findProtocolById(params.id)

    if (protocol)
        return (
            <>
                <Heading title={'Protocolo de investigación'} />
                <ProtocolForm protocol={protocol} />
            </>
        )
}
