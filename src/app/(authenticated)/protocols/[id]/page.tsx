import View from '@protocol/protocol-view-template'
import ProtocolStatesDictionary from '@utils/dictionaries/ProtocolStatesDictionary'
import { redirect } from 'next/navigation'
import { findProtocolById } from 'repositories/protocol'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import EditButton from '@protocol/elements/action-buttons/edit'
import AcceptButton from '@protocol/elements/action-buttons/accept'
import ApproveButton from '@protocol/elements/action-buttons/approve'
import PublishButton from '@protocol/elements/action-buttons/publish'

export default async function Page({ params }: { params: { id: string } }) {
    if (params.id === 'new') return redirect('/protocols/new/0')
    const session = await getServerSession(authOptions)
    const protocol = await findProtocolById(params.id)
    if (!protocol) {
        return redirect('/protocols')
    }
    return (
        <>
            <div className="mr-3 mt-1 flex items-center gap-2 md:ml-8">
                <div className="flex-1">
                    <span className="rounded border bg-gray-50 px-2 py-0.5 text-sm font-semibold uppercase text-gray-600">
                        {ProtocolStatesDictionary[protocol?.state!]}
                    </span>
                </div>
                <ApproveButton
                    role={session?.user?.role!}
                    protocol={protocol!}
                />
                <AcceptButton
                    role={session?.user?.role!}
                    protocol={protocol!}
                />
                <PublishButton
                    role={session?.user?.role!}
                    protocol={protocol!}
                />
                <EditButton
                    role={session?.user?.role!}
                    state={protocol?.state!}
                    id={protocol?.id!}
                />
            </div>
            <View sections={protocol.sections} role={session?.user?.role!} />
        </>
    )
}
