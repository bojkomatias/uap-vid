import PublishButton from '@protocol/elements/action-buttons/Publish'
import ProtocolForm from '@protocol/Form'
import { getCurrentConvocatory } from '@repositories/convocatory'
import { initialSectionValues } from '@utils/createContext'
import { canExecute } from '@utils/scopes'
import { STATE } from '@utils/zod'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { findProtocolById } from 'repositories/protocol'

export default async function Page({
    params,
}: {
    params: { id: string; section: string }
}) {
    const session = await getServerSession(authOptions)
    const convocatory = await getCurrentConvocatory()

    const protocol =
        params.id === 'new'
            ? {
                  convocatoryId: convocatory?.id!,
                  state: STATE.DRAFT,
                  researcher: session?.user?.id!,
                  sections: initialSectionValues,
              }
            : await findProtocolById(params.id)

    if (!protocol) redirect('/protocols')
    if (!canExecute('EDIT', session?.user?.role!, protocol?.state!))
        redirect('/protocols')

    return (
        <>
            <div className="justify-end flex items-center mr-3 gap-2 mt-1">
                <PublishButton
                    role={session?.user?.role!}
                    protocol={protocol}
                />
            </div>
            <ProtocolForm protocol={protocol} />
        </>
    )
}
