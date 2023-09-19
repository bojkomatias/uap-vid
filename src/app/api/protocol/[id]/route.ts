/* eslint-disable @next/next/no-server-import-in-page */
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
    updateProtocolById,
    updateProtocolStateById,
} from '@repositories/protocol'
import { State } from '@prisma/client'
import { logProtocolUpdate } from '@utils/logger'
import { getToken } from 'next-auth/jwt'
import { canExecute } from '@utils/scopes'
import { getSecretariesEmailsByAcademicUnit } from '@repositories/academic-unit'

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const token = await getToken({ req: request })

    const id = params.id
    const protocol = await request.json()

    if (
        token &&
        canExecute(
            token.user.id === protocol.researcherId ? 'EDIT_BY_OWNER' : 'EDIT',
            token.user.role,
            protocol.state
        )
    ) {
        if (protocol) delete protocol.id
        const updated = await updateProtocolById(id, protocol)

        if (!updated) {
            return new Response('We cannot update the protocol', {
                status: 500,
            })
        }
        return NextResponse.json({ success: true })
    }
    return new Response('Not allowed', { status: 401 })
}

// Patches researcher
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const token = await getToken({ req: request })
    if (token!.user.role !== 'ADMIN')
        return new Response('Not allowed', { status: 401 })

    const id = params.id
    const data = await request.json()

    const patched = await updateProtocolById(id, data)
    if (!patched) {
        return new Response('We could not patch the researcher', {
            status: 500,
        })
    }
    return NextResponse.json({ success: true })
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const token = await getToken({ req: request })
    // Deleted in in disguise an STATE transition => 'DELETED'
    const { state } = await request.json()

    const id = params.id
    const deleted = await updateProtocolStateById(id, State.DELETED)

    await logProtocolUpdate({
        user: token!.user,
        fromState: state,
        toState: State.DELETED,
        protocolId: id,
    })

    if (!deleted)
        return new Response("We couldn't delete the protocol", { status: 500 })

    return NextResponse.json({ success: true })
}
