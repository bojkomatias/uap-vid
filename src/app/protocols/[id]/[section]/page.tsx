import { canExecute } from '@utils/scopes'
import { getServerSession } from 'next-auth'
import dynamic from 'next/dynamic'
import { redirect } from 'next/navigation'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { findProtocolById } from 'repositories/protocol'

const ProtocolForm = dynamic(() => import('@protocol/Form'))

export default async function Page({
    params,
}: {
    params: { id: string; section: string }
}) {
    const protocol = await findProtocolById(params.id, false)
    const session = await getServerSession(authOptions)
    if (!protocol) redirect('/protocols')
    if (!canExecute('EDIT', session?.user?.role!, protocol?.state!))
        redirect('/protocols')

    return <ProtocolForm protocol={protocol} />
}
