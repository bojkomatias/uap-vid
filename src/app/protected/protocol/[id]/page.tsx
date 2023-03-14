import { Heading } from '@layout/Heading'
import ProtocolForm from '@protocol/Form'
import { findProtocolById } from 'repositories/protocol'

export default async function Page({ params }: any) {
    const protocol = await findProtocolById(params.id)

    if (protocol)
        return (
            <>
                <Heading title={'Protocolo de investigación'} />
                <ProtocolForm protocol={protocol} />
            </>
        )
}
