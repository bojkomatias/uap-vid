import { Heading } from '@layout/Heading'
import PublishButton from '@protocol/elements/action-buttons/Publish'
import { getCurrentConvocatory } from '@repositories/convocatory'
import { initialSectionValues } from '@utils/createContext'
import { canExecute } from '@utils/scopes'
import { STATE } from '@utils/zod'
import { getServerSession } from 'next-auth'
import dynamic from 'next/dynamic'
import { redirect } from 'next/navigation'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { findProtocolById } from 'repositories/protocol'

const ProtocolForm = dynamic(() => import('@protocol/Form'))

export default async function Page({
    params,
    searchParams,
}: {
    params: { id: string; section: string }
    searchParams: { convocatory: string }
}) {
    const session = await getServerSession(authOptions)
    if (!searchParams.convocatory && params.id === 'new')
        return redirect('/protocols')

    const protocol =
        params.id === 'new'
            ? {
                  convocatoryId: searchParams.convocatory,
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
            <div className="mr-3 mt-1 flex items-center justify-end gap-2">
                <PublishButton
                    role={session?.user?.role!}
                    protocol={protocol}
                />
            </div>
            <ProtocolForm protocol={protocol} />
        </>
    )
}
