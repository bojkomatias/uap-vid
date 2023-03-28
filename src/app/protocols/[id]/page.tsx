import EditButton from '@protocol/elements/action-buttons/Edit'
import PublishButton from '@protocol/elements/action-buttons/Publish'
import View from '@protocol/View'
import ProtocolStatesDictionary from '@utils/dictionaries/ProtocolStatesDictionary'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { findProtocolById } from 'repositories/protocol'

export default async function Page({ params }: { params: { id: string } }) {
    if (params.id === 'new') return redirect('/protocols/new/0')
    const session = await getServerSession(authOptions)
    const protocol = await findProtocolById(params.id)

    return (
        <>
            <div className="mr-3 mt-1 flex items-center gap-2 md:ml-8">
                <div className="flex-1">
                    <span className="rounded border bg-gray-50 px-2 py-0.5 text-sm font-semibold uppercase text-gray-600">
                        {ProtocolStatesDictionary[protocol?.state!]}
                    </span>
                </div>
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
            <View protocol={protocol!} role={session?.user?.role!} />
        </>
    )
}
