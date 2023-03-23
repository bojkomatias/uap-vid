import { Heading } from '@layout/Heading'
import ProtocolForm from '@protocol/Form'
import { getCurrentConvocatory } from '@repositories/convocatory'
import { initialSectionValues } from '@utils/createContext'
import { canExecute } from '@utils/scopes'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from 'pages/api/auth/[...nextauth]'

export default async function Page() {
    const session = await getServerSession(authOptions)
    if (!canExecute('CREATE', session?.user?.role!, 'NOT_CREATED'))
        redirect('/protocols')
    const convocatory = await getCurrentConvocatory()
    return (
        <>
            <Heading title={'Nuevo protocolo de investigación'} />
            <ProtocolForm
                protocol={{
                    convocatoryId: convocatory?.id!,
                    state: 'DRAFT',
                    researcher: session?.user?.id!,
                    sections: initialSectionValues,
                }}
            />
        </>
    )
}
