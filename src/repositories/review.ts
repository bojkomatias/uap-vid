import type { Review, ReviewType } from '@prisma/client'
import { cache } from 'react'
import { prisma } from '../utils/bd'

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
            include: {
                reviewer: true,
            },
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
            data: '',
            type: type,
        },
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
            data: '',
            type: type,
        },
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
        })
        return review
    } catch (error) {
        return console.log(error)
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
    })
    return review
}
