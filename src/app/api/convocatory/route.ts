/* eslint-disable @next/next/no-server-import-in-page */

import { createConvocatory } from '@repositories/convocatory'
import { getServerSession } from 'next-auth';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server'
import { authOptions } from 'pages/api/auth/[...nextauth]';

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return new Response('Unauthorized', { status: 401 })
    }

    const sessionRole = session.user.role

    if (sessionRole.toLocaleLowerCase() !== 'admin') {
        return new Response('Unauthorized', { status: 401 })
    }
    const data = await request.json()
    const created = await createConvocatory(data)

    if (!created) {
        return new Response('We cannot create the convocatory', { status: 500 })
    }

    return NextResponse.json(created)
}
