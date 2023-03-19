import { protocol, ProtocolReviewsComments } from '@prisma/client'
import { prisma } from '../utils/bd'

const createComment = async (id: string, data: ProtocolReviewsComments) => {
    const protocol = await prisma.protocol.update({
        where: {
            id,
        },
        data: {
            reviews: {
                upsert: {
                    set: {
                        methodologic: {
                            reviewer: '',
                            veredict: '',
                            comments: [
                                {
                                    data: 'upsertee? set?',
                                    date: new Date(),
                                },
                            ],
                        },
                    },
                    update: {
                        methodologic: {
                            update: {
                                comments: {
                                    push: {
                                        date: new Date(),
                                        data: 'updatee?',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    })
    return protocol
}

export { createComment }
