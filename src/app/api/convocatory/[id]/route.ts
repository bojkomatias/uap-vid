/* eslint-disable @next/next/no-server-import-in-page */
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { updateConvocatory } from '@repositories/convocatory'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'

export async function PUT(request: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return new Response('Unauthorized', { status: 401 })
    }

    const sessionRole = session.user.role

    if (sessionRole.toLocaleLowerCase() !== 'admin') {
        return new Response('Unauthorized', { status: 401 })
    }
    const data = await request.json()
    const updated = await updateConvocatory(data)
    if (!updated) {
        return new Response('We cannot update the convocatory', { status: 500 })
    }
    return NextResponse.json({ success: true })
}
