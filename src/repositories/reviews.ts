import {
    protocol,
    ProtocolReviews,
    ProtocolReviewsComments,
} from '@prisma/client'
import { prisma } from '../utils/bd'

export const createComment = async (
    comment: ProtocolReviewsComments,
    id: string
) => {
    const review = await prisma.protocol.update({
        where: {
            id,
        },
        data: {
            reviews: {
                methodologic: {
                    update: {
                        comments: { set: [{ date: new Date(), data: '' }] },
                    },
                },
            },
        },
    })
    return review
}
