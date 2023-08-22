/* eslint-disable @next/next/no-server-import-in-page */
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { Role, State } from '@prisma/client'
import { updateProtocolStateById } from '@repositories/protocol'
import { logProtocolUpdate } from '@utils/logger'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/[...nextauth]/route'

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return new Response('Unauthorized', { status: 401 })
    }
    const sessionRole = session.user.role
    if (sessionRole !== Role.ADMIN) {
        return new Response('Unauthorized', { status: 401 })
    }

    const id = params.id
    const protocol = await request.json()
    if (protocol) delete protocol.id
    const updated = await updateProtocolStateById(id, State.ON_GOING)

    await logProtocolUpdate({
        fromState: State.ACCEPTED,
        toState: State.ON_GOING,
        protocolId: id,
    })

    if (!updated) {
        return new Response('We cannot approve this protocol', { status: 500 })
    }
    return NextResponse.json({ success: true })
}
