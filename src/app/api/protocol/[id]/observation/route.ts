/* eslint-disable @next/next/no-server-import-in-page */
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { Role, State } from '@prisma/client'
import { newObservation } from '@repositories/protocol'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/[...nextauth]/route'

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return new Response('Unauthorized', { status: 401 })
    }
    const sessionRole = session.user.role
    if (sessionRole !== Role.ADMIN) {
        return new Response('Unauthorized', { status: 401 })
    }

    const id = params.id
    const observation = await request.json()

    const updated = await newObservation(id, observation)

    if (!updated) {
        return new Response('Error in the observation', { status: 500 })
    }
    return NextResponse.json({ success: true })
}
