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
    console.log('HOLA ID', id)
    const review = await prisma.protocol.update({
        where: {
            id,
        },
        data: {
            reviews: {
                upsert: {
                    set: {
                        methodologic: {
                            reviewer: '62cf537849c524d1908a7af2',
                            veredict: '',
                            comments: [comment],
                        },
                    },
                    update: {
                        methodologic: {
                            update: {
                                comments: {
                                    push: comment,
                                },
                            },
                        },
                    },
                },
            },
        },
    })
    return review
}
