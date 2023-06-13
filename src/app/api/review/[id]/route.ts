/* eslint-disable @next/next/no-server-import-in-page */
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { markRevised, updateReview } from '@repositories/review'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { Role } from '@prisma/client'

export async function PUT(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return new Response('Unauthorized', { status: 401 })
    }
    const sessionRole = session.user.role
    if (sessionRole === Role.RESEARCHER) {
        return new Response('Unauthorized', { status: 401 })
    }
    const data = await request.json()
    const review = await updateReview(data)

    return NextResponse.json(review)
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return new Response('Unauthorized', { status: 401 })
    }

    const data = await request.json()
    const review = await markRevised(params.id, data)
    return NextResponse.json(review)
}
