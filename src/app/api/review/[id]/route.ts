/* eslint-disable @next/next/no-server-import-in-page */
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { markRevised, updateReview } from '@repositories/review'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/[...nextauth]/route'
import { Role } from '@prisma/client'
import { emailer, useCases } from '@utils/emailer'

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

    if (review) {
        emailer({
            useCase: useCases.onReview,
            email: review.protocol.researcher.email,
            protocolId: review.protocolId,
        })
    }
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

    const revised = await request.json()
    const review = await markRevised(params.id, revised)
    if (review) {
        emailer({
            useCase: useCases.onRevised,
            email: review.reviewer.email,
            protocolId: review.protocolId,
        })
        return NextResponse.json(review)
    }
    return new Response('Error revising the review', { status: 500 })
}
