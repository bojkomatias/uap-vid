/* eslint-disable @next/next/no-server-import-in-page */
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
    assignReviewerToProtocol,
    reassignReviewerToProtocol,
} from '@repositories/review'
import { type Review } from '@prisma/client'
import { ReviewType, State } from '@prisma/client'
import { updateProtocolStateById } from '@repositories/protocol'
import { logProtocolUpdate } from '@utils/logger'
import { getToken } from 'next-auth/jwt'
import { canExecute } from '@utils/scopes'
import { emailer, useCases } from '@utils/emailer'

const newStateByReviewType = {
    [ReviewType.METHODOLOGICAL]: State.METHODOLOGICAL_EVALUATION,
    [ReviewType.SCIENTIFIC_INTERNAL]: State.SCIENTIFIC_EVALUATION,
    [ReviewType.SCIENTIFIC_EXTERNAL]: State.SCIENTIFIC_EVALUATION,
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const token = await getToken({ req: request })

    const data = (await request.json()) as {
        protocolState: State
        review: Review
        reviewerId: string
        type: ReviewType
    }
    if (!data) {
        return NextResponse.json({ error: 'No data provided' }, { status: 400 })
    }
    // Not allowed by state or role to assign
    if (
        !canExecute(
            data.type === 'METHODOLOGICAL'
                ? 'ASSIGN_TO_METHODOLOGIST'
                : 'ASSIGN_TO_SCIENTIFIC',
            token!.user.role,
            data.protocolState
        )
    )
        return new Response('Not allowed', { status: 406 })

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
        emailer({
            useCase: useCases.onAssignation,
            email: newReview.reviewer.email,
            protocolId: newReview.protocolId,
        })

        const protocol =
            data.type === ReviewType.SCIENTIFIC_THIRD
                ? null
                : await updateProtocolStateById(
                      params.id,
                      newStateByReviewType[data.type]
                  )

        if (data.type !== ReviewType.SCIENTIFIC_THIRD)
            await logProtocolUpdate({
                user: token!.user,
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
    emailer({
        useCase: useCases.onAssignation,
        email: updatedReview.reviewer.email,
        protocolId: updatedReview.protocolId,
    })
    return NextResponse.json({ updatedReview }, { status: 200 })
}
