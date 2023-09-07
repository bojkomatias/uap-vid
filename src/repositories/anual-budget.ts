import type { AnualBudget } from '@prisma/client'
import { cache } from 'react'
import { prisma } from 'utils/bd'

export const getAllConvocatories = cache(async () => {
    try {
        return await prisma.anualBudget.findMany()
    } catch (e) {
        return null
    }
})
export const getanualBudgetById = cache(async (id: string) => {
    try {
        return await prisma.anualBudget.findFirst({ where: { id } })
    } catch (e) {
        return null
    }
})

// export const getCurrentanualBudget = cache(async () => {
//     try {
//         return await prisma.anualBudget.findFirst({
//             where: {
//                 AND: [
//                     {
//                         from: {
//                             lte: new Date(),
//                         },
//                     },
//                     {
//                         to: {
//                             gt: new Date(),
//                         },
//                     },
//                 ],
//             },
//         })
//     } catch (e) {
//         return null
//     }
// })

export const createAnualBudget = async (data: AnualBudget) => {
    try {
        return await prisma.anualBudget.create({
            data,
        })
    } catch (e) {
        return null
    }
}
export const updateAnualBudget = async (data: AnualBudget) => {
    const { id, ...rest } = data
    try {
        return await prisma.anualBudget.update({
            where: { id },
            data: rest,
        })
    } catch (e) {
        return null
    }
}
