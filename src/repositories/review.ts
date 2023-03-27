import { Review } from '@prisma/client'
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
            where: {
                protocolId: protocolId,
                reviewerId: reviewerId,
            },
        })
        return review
    }
)

export const updateReview = async (reviewId: string, data: Review) => {
    const review = await prisma.review.update({
        where: {
            id: reviewId,
        },
        data,
    })
    return review
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
