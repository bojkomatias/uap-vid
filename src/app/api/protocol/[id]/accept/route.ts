/* eslint-disable @next/next/no-server-import-in-page */
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { updateProtocolStateById } from '@repositories/protocol'
import { logProtocolUpdate } from '@utils/logger'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/[...nextauth]/route'
import { canExecute } from '@utils/scopes'
import { State } from '@prisma/client'

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions)
    const id = params.id
    const protocol = await request.json()
    if (session && canExecute('ACCEPT', session.user.role, protocol.state)) {
        const updated = await updateProtocolStateById(id, State.ACCEPTED)

        await logProtocolUpdate({
            fromState: State.SCIENTIFIC_EVALUATION,
            toState: State.ACCEPTED,
            protocolId: id,
        })

        if (!updated) {
            return new Response('We cannot accept this protocol', {
                status: 500,
            })
        }
        return NextResponse.json({ success: true })
    }
    return new Response('Unauthorized', { status: 401 })
}
