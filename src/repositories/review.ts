import { Review, ReviewType } from '@prisma/client'
import { cache } from 'react'
import { prisma } from '../utils/bd'

export const getReviewsByProtocol = cache(async (protocolId: string) => {
    const reviews = await prisma.review.findMany({
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
            data: '',
            type: type
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
            type: type
        },
    })
    return review
}

export const createReview = async (reviewId: string, data: Review) => {
    const review = await prisma.review.update({
        where: {
            id: reviewId,
        },
        data,
    })
    return review
}
