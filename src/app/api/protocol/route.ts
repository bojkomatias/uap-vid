/* eslint-disable @next/next/no-server-import-in-page */

import { ROLE } from '@utils/zod'
import { NextRequest, NextResponse } from 'next/server'
import {
    createProtocol,
    getProtocolByRol,
} from '../../../repositories/protocol'
export async function POST(request: NextRequest) {
    const data = await request.json()
    const created = await createProtocol({
        createdAt: new Date(),
        ...data,
    })

    if (!created) {
        return new Response('We cannot create the protocol', { status: 500 })
    }

    return NextResponse.json(created)
}

