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
    const review = await prisma.review.findFirst({
        where: {
            protocolId: protocolId,
            reviewerId: reviewerId,
        },
    })
    return review
}

export const createReview = async (id: string, data: Review) => {
    // const protocol = await prisma.protocol.update({
    //     where: {
    //         id,
    //     },
    //     data: {
    //         reviews: {
    //             upsert: {
    //                 set: {
    //                     methodologic: {
    //                         reviewer: '',
    //                         veredict: '',
    //                         comments: [
    //                             {
    //                                 data: 'upsertee? set?',
    //                                 date: new Date(),
    //                             },
    //                         ],
    //                     },
    //                 },
    //                 update: {
    //                     methodologic: {
    //                         update: {
    //                             comments: {
    //                                 push: {
    //                                     date: new Date(),
    //                                     data: 'updatee?',
    //                                 },
    //                             },
    //                         },
    //                     },
    //                 },
    //             },
    //         },
    //     },
    // })
    return true
}
