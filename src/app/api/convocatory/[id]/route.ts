/* eslint-disable @next/next/no-server-import-in-page */
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { updateConvocatory } from '@repositories/convocatory'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/[...nextauth]/route'
import { canAccess } from '@utils/scopes'

export async function PUT(request: NextRequest) {
    const session = await getServerSession(authOptions)

    if (session && canAccess('CONVOCATORIES', session.user.role)) {
        const data = await request.json()
        const updated = await updateConvocatory(data)

        if (!updated) {
            return new Response('We cannot update the convocatory', {
                status: 500,
            })
        }
        return NextResponse.json({ success: true })
    }
    return new Response('Unauthorized', { status: 401 })
}
