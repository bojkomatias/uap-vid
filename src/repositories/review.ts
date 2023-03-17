import { protocol, ProtocolReviewsComments } from '@prisma/client'
import { prisma } from '../utils/bd'

const createComment = async (id: string, data: ProtocolReviewsComments) => {
    const protocol = await prisma.protocol.update({
        where: {
            id,
        },
        data: {
            reviews: {
                update: {
                    methodologic: {
                        update: { comments: { set: [data] } },
                    },
                },
            },
        },
    })
    return protocol
}

export { createComment }
