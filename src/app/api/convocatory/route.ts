/* eslint-disable @next/next/no-server-import-in-page */

import { createConvocatory } from '@repositories/convocatory'
import { getServerSession } from 'next-auth'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { authOptions } from 'app/api/auth/[...nextauth]/route'
import { canAccess } from '@utils/scopes'

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)

    if (session && canAccess('CONVOCATORIES', session.user.role)) {
        const data = await request.json()
        const created = await createConvocatory(data)

        if (!created) {
            return new Response('We cannot create the convocatory', {
                status: 500,
            })
        }

        return NextResponse.json(created)
    }
    return new Response('Unauthorized', { status: 401 })
}
