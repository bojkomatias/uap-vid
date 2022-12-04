import Heading from '@layout/Heading'
import { findProtocolById } from 'repositories/protocol'

import Protocol from '../../../../components/protocol/Protocol'

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
                <Protocol protocol={protocol} />
            </>
        )
}
