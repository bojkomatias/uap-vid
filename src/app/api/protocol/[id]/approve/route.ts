/* eslint-disable @next/next/no-server-import-in-page */
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { updateProtocolStateById } from '@repositories/protocol'
import { logProtocolUpdate } from '@utils/logger'
import { canExecute } from '@utils/scopes'
import { State } from '@prisma/client'
import { getToken } from 'next-auth/jwt'
import { emailer, useCases } from '@utils/emailer'

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const token = await getToken({ req: request })
    const id = params.id
    const protocol = await request.json()
    if (token && canExecute('APPROVE', token.user.role, protocol.state)) {
        const updated = await updateProtocolStateById(id, State.ON_GOING)

        await logProtocolUpdate({
            user: token.user,
            fromState: State.ACCEPTED,
            toState: State.ON_GOING,
            protocolId: id,
        })

        if (!updated) {
            return new Response('We cannot approve this protocol', {
                status: 500,
            })
        }
    }
    return NextResponse.json({ success: true })
}
