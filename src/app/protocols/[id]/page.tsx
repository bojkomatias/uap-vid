import View from '@protocol/View'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { findProtocolById } from 'repositories/protocol'

export default async function Page({ params }: { params: { id: string } }) {
    if (params.id === 'new') return redirect('/protocols/new/0')
    const session = await getServerSession(authOptions)
    const protocol = await findProtocolById(params.id)

    return <View protocol={protocol!} role={session?.user?.role!} />
}
