import { Heading } from '@layout/Heading'
import ProtocolForm from '@protocol/Form'
import { initialProtocolValues } from '@utils/createContext'

export default async function Page() {
    return (
        <>
            <Heading title={'Nuevo protocolo de investigación'} />
            <ProtocolForm protocol={initialProtocolValues} />
        </>
    )
}
