import { ProtocolReviewsComments } from '@prisma/client'

const createComment = async (id: string, data: ProtocolReviewsComments) => {
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
