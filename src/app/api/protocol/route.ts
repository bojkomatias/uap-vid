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

// researcher ID: 641a036ccccfe426a64175de
// reviewer Scientific ID: 641a036ccccfe426a64175dd
// reviewer Method ID: 641a036ccccfe426a64175dc

export async function GET() {
    try {
        const protocols = await getProtocolByRol(
            ROLE.METHODOLOGIST,
            '641a036ccccfe426a64175dc',
            1 //Número de página
        )
        console.log(protocols)

        return NextResponse.json(protocols)
    } catch (e) {
        return NextResponse.json(e, { status: 500 })
    }
}
