import { prisma } from 'utils/bd'

export const getAllConvocatories = async () => {
    try {
        return await prisma.convocatory.findMany()
    } catch (e) {
        console.log(e)
        return null
    }
}
export const getCurrentConvocatory = async () => {
    try {
        return await prisma.convocatory.findFirst({
            where: {
                year: {
                    equals: new Date().getFullYear(),
                },
            },
        })
    } catch (e) {
        console.log(e)
        return null
    }
}
