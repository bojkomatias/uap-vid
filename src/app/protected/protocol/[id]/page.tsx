import { Heading } from '@layout/Heading'
import ProtocolForm from '@protocol/Form'
import { findProtocolById } from 'repositories/protocol'

export default async function Page({ params }: any) {
    const protocol = await findProtocolById(params.id)

    if (protocol)
        return (
            <>
                <Heading
                    title={
                        <span>
                            Protocolo:{' '}
                            <span className="font-light">
                                {protocol.sections.identification.title}
                            </span>
                        </span>
                    }
                />
                <ProtocolForm protocol={protocol} />
            </>
        )
}
