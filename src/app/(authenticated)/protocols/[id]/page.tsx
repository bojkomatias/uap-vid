import View from '@protocol/protocol-view-template'
import { redirect } from 'next/navigation'
import { findProtocolById } from 'repositories/protocol'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import EditButton from '@protocol/elements/action-buttons/edit'
import AcceptButton from '@protocol/elements/action-buttons/accept'
import ApproveButton from '@protocol/elements/action-buttons/approve'
import PublishButton from '@protocol/elements/action-buttons/publish'
import { getReviewsByProtocol } from '@repositories/review'
import { PDF } from 'modules/pdf'

export default async function Page({ params }: { params: { id: string } }) {
    if (params.id === 'new') return redirect('/protocols/new/0')
    const session = await getServerSession(authOptions)
    if (!session) return
    const protocol = await findProtocolById(params.id)
    if (!protocol) {
        return redirect('/protocols')
    }

    const reviews = await getReviewsByProtocol(protocol.id)

    return (
        <>
            <div className="mr-3 mt-1 flex items-center justify-end gap-2 md:ml-8">
                <PDF protocol={protocol} />
                <ApproveButton role={session.user.role} protocol={protocol} />
                <AcceptButton
                    role={session.user.role}
                    protocol={protocol}
                    reviews={reviews}
                />
                <PublishButton role={session.user.role} protocol={protocol} />
                <EditButton
                    user={session.user}
                    researcherId={protocol.researcherId}
                    state={protocol.state}
                    id={protocol?.id}
                />
            </div>

            <View sections={protocol.sections} role={session.user.role} />
        </>
    )
}
