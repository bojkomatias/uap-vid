/* eslint-disable @next/next/no-server-import-in-page */
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { deleteProtocolById, updateProtocolById } from '@repositories/protocol'

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    //I cannot find the type for params https://beta.nextjs.org/docs/routing/route-handlers#dynamic-route-segments
    // You put them according to the naming of the folder ([id] params.id || [...your_mom] params.your_mom[0])
    const id = params.id
    const protocol = await request.json()
    if (protocol) delete protocol.id
    const updated = await updateProtocolById(id, protocol)
    if (!updated) {
        return new Response('We cannot update the protocol', { status: 500 })
    }
    return NextResponse.json({ success: true })
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = params.id
    const deleted = await deleteProtocolById(id)

    if (!deleted)
        return new Response("We couldn't delete the protocol", { status: 500 })

    return NextResponse.json({ success: true })
}
