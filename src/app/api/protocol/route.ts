import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createProtocol } from '../../../repositories/protocol'
import { getConvocatoryByIdWithCount } from '@repositories/convocatory'
import type { Protocol } from '@prisma/client'

export async function POST(request: NextRequest) {
    const data = (await request.json()) as Protocol

    // Get the convocatory with the protocol count
    const convocatory = await getConvocatoryByIdWithCount(data.convocatoryId)

    const pNumber =
        convocatory?.year.toString().substring(2, 4) +
        '.' +
        convocatory?._count.protocols.toString()

    data.protocolNumber = pNumber

    const created = await createProtocol(data)

    if (!created) {
        return new Response('We cannot create the protocol', { status: 500 })
    }

    return NextResponse.json(created)
}
