import EditButton from '@protocol/elements/action-buttons/Edit'
import PublishButton from '@protocol/elements/action-buttons/Publish'
import View from '@protocol/View'
import { canExecute } from '@utils/scopes'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { findProtocolById } from 'repositories/protocol'

export default async function Page({ params }: { params: { id: string } }) {
    if (params.id === 'new') return <></>
    const protocol = await findProtocolById(params.id, false)

    return <View protocol={protocol!} />
}
