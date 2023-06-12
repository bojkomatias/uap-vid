/* eslint-disable @next/next/no-server-import-in-page */
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
    assignReviewerToProtocol,
    reassignReviewerToProtocol,
} from '@repositories/review'
import { type Review, Role } from '@prisma/client'
import { ReviewType, State } from '@prisma/client'
import { updateProtocolStateById } from '@repositories/protocol'
import { logProtocolUpdate } from '@utils/logger'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'

const newStateByReviewType = {
    [ReviewType.METHODOLOGICAL]: State.METHODOLOGICAL_EVALUATION,
    [ReviewType.SCIENTIFIC_INTERNAL]: State.SCIENTIFIC_EVALUATION,
    [ReviewType.SCIENTIFIC_EXTERNAL]: State.SCIENTIFIC_EVALUATION,
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return new Response('Unauthorized', { status: 401 })
    }
    const sessionRole = session.user.role

    if (sessionRole !== (Role.ADMIN || Role.SECRETARY)) {
        return new Response('Unauthorized', { status: 401 })
    }
    const data = (await request.json()) as {
        review: Review
        reviewerId: string
        type: ReviewType
    }
    if (!data) {
        return NextResponse.json({ error: 'No data provided' }, { status: 400 })
    }

    //If is new review, create it
    if (!data.review) {
        const newReview = await assignReviewerToProtocol(
            params.id,
            data.reviewerId,
            data.type
        )
        if (!newReview) {
            return NextResponse.json(
                { error: 'Error assigning reviewer to protocol' },
                { status: 500 }
            )
        }

        const protocol =
            data.type === ReviewType.SCIENTIFIC_THIRD
                ? null
                : await updateProtocolStateById(
                      params.id,
                      newStateByReviewType[data.type]
                  )

        if (data.type !== ReviewType.SCIENTIFIC_THIRD)
            await logProtocolUpdate({
                fromState:
                    data.type === ReviewType.METHODOLOGICAL
                        ? State.PUBLISHED
                        : State.METHODOLOGICAL_EVALUATION,
                toState: newStateByReviewType[data.type],
                protocolId: params.id,
            })

        return NextResponse.json({ newReview, protocol }, { status: 200 })
    }

    //If is existing review, update it
    const updatedReview = await reassignReviewerToProtocol(
        data.review.id,
        params.id,
        data.reviewerId,
        data.type
    )

    return NextResponse.json({ updatedReview }, { status: 200 })
}
