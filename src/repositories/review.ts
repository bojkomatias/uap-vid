import { Review } from '@prisma/client'
import { prisma } from '../utils/bd'

export const getReviewsByProtocol = async (protocolId: string) => {
    const reviews = await prisma.review.findMany({
        where: { protocolId },
    })
    return reviews
}

export const getProtocolReviewByReviewer = async (
    protocolId: string,
    reviewerId: string
) => {
    console.log('***********************************************');
    console.log('protocolId: ', protocolId);
    console.log('reviewerId: ', reviewerId);

    const review = await prisma.review.findFirst({
        where: {
            protocolId: protocolId,
            reviewerId: reviewerId,
        },
    })
    console.log(review);

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