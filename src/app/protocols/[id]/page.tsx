import EditButton from '@protocol/elements/action-buttons/Edit'
import PublishButton from '@protocol/elements/action-buttons/Publish'
import View from '@protocol/View'
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
            <div className="justify-end flex items-center mr-3 gap-2 mt-1">
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
