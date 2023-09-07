/* eslint-disable @next/next/no-server-import-in-page */
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { updateConvocatory } from '@repositories/convocatory'

export async function PUT(request: NextRequest) {
    const data = await request.json()
    const updated = await updateConvocatory(data)

    if (!updated) {
        return new Response('We cannot update the convocatory', {
            status: 500,
        })
    }
    return NextResponse.json({ success: true })
}
