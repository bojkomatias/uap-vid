/* eslint-disable @next/next/no-server-import-in-page */
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
    updateProtocolById,
    updateProtocolStateById,
} from '@repositories/protocol'
import { Role, State } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { logProtocolUpdate } from '@utils/logger'

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return new Response('Unauthorized', { status: 401 })
    }

    const id = params.id
    const protocol = await request.json()
    if (protocol) delete protocol.id
    const updated = await updateProtocolById(id, protocol)
    if (!updated) {
        return new Response('We cannot update the protocol', {
            status: 500,
        })
    }
    return NextResponse.json({ success: true })
}

export async function DELETE(
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
    // Deleted in in disguise an STATE transition => 'DELETED'
    const { state } = await request.json()

    const id = params.id
    const deleted = await updateProtocolStateById(id, State.DELETED)

    await logProtocolUpdate({
        fromState: state,
        toState: State.DELETED,
        protocolId: id,
    })

    if (!deleted)
        return new Response("We couldn't delete the protocol", { status: 500 })

    return NextResponse.json({ success: true })
}
