import EditButton from '@protocol/elements/action-buttons/Edit'
import PublishButton from '@protocol/elements/action-buttons/Publish'
import View from '@protocol/View'
import { canExecute } from '@utils/scopes'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { findProtocolById } from 'repositories/protocol'

export default async function Page({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)
    const protocol = await findProtocolById(params.id)
    if (!protocol) redirect('/protocols')
    if (!canExecute('VIEW', session?.user?.role!, protocol?.state!))
        redirect('/protocols')

    return <View protocol={protocol} />
}
