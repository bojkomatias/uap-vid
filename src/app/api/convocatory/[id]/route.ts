// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'
import { updateProtocolById } from '@repositories/protocol'
import { updateConvocatory } from '@repositories/convocatory'

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const data = await request.json()
    const updated = await updateConvocatory(data)
    if (!updated) {
        return new Response('We cannot update the convocatory', { status: 500 })
    }
    return NextResponse.json({ success: true })
}
