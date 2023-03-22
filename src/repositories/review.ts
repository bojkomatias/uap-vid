import { ReviewsComments } from '@prisma/client'
import { prisma } from '../utils/bd'

export const createComment = async (id: string, data: ReviewsComments) => {
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
