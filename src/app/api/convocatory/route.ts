/* eslint-disable @next/next/no-server-import-in-page */

import { createConvocatory } from '@repositories/convocatory'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    const data = await request.json()
    const created = await createConvocatory(data)

    if (!created) {
        return new Response('We cannot create the convocatory', { status: 500 })
    }

    return NextResponse.json(created)
}
