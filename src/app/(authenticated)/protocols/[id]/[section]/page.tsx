import ProtocolForm from '@protocol/protocol-form-template'
import { initialSectionValues } from '@utils/createContext'
import { canExecute } from '@utils/scopes'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import { findProtocolById } from 'repositories/protocol'
import { Action, ProtocolState } from '@prisma/client'

export default async function Page({
    params,
    searchParams,
}: {
    params: { id: string; section: string }
    searchParams: { convocatory: string }
}) {
    const session = await getServerSession(authOptions)
    if (!session) return
    if (!searchParams.convocatory && params.id === 'new') redirect('/protocols')

    const protocol =
        params.id === 'new'
            ? {
                  convocatoryId: searchParams.convocatory,
                  state: ProtocolState.DRAFT,
                  researcherId: session.user.id,
                  sections: initialSectionValues,
              }
            : await findProtocolById(params.id)

    if (!protocol) redirect('/protocols')
    if (
        !canExecute(
            session.user.id === protocol.researcherId
                ? Action.EDIT_BY_OWNER
                : Action.EDIT,
            session.user.role,
            protocol.state
        )
    )
        redirect('/protocols')

    return <ProtocolForm protocol={protocol} />
}
