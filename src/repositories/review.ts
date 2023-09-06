import type { Review, ReviewType } from '@prisma/client'
import { cache } from 'react'
import { prisma } from '../utils/bd'
import { getInitialQuestionsByType } from '@utils/reviewQuestionInitiator'

export const getReviewsByProtocol = cache(async (protocolId: string) => {
    const reviews = await prisma.review.findMany({
        include: {
            reviewer: true,
        },
        where: { protocolId },
    })
    return reviews
})

export const getProtocolReviewByReviewer = cache(
    async (protocolId: string, reviewerId: string) => {
        const review = await prisma.review.findFirst({
            where: {
                protocolId: protocolId,
                reviewerId: reviewerId,
            },
        })
        return review
    }
)

export const assignReviewerToProtocol = async (
    protocolId: string,
    reviewerId: string,
    type: ReviewType
) => {
    const review = await prisma.review.create({
        data: {
            protocolId,
            reviewerId,
            questions: getInitialQuestionsByType(type),
            type: type,
        },
        include: { reviewer: { select: { email: true } } },
    })
    return review
}

export const reassignReviewerToProtocol = async (
    reviewId: string,
    protocolId: string,
    reviewerId: string,
    type: ReviewType
) => {
    const review = await prisma.review.update({
        where: {
            id: reviewId,
        },
        data: {
            protocolId,
            reviewerId,
            questions: getInitialQuestionsByType(type),
            type: type,
        },
        include: { reviewer: { select: { email: true } } },
    })
    return review
}

export const updateReview = async (data: Review) => {
    const { id, ...rest } = data
    try {
        const review = await prisma.review.update({
            where: {
                id,
            },
            data: rest,
            include: {
                protocol: {
                    select: { researcher: { select: { email: true } } },
                },
            },
        })
        return review
    } catch (error) {
        return null
    }
}

export const markRevised = async (reviewId: string, revised: boolean) => {
    const review = await prisma.review.update({
        where: {
            id: reviewId,
        },
        data: {
            revised,
        },
        include: { reviewer: { select: { email: true } } },
    })
    return review
}
