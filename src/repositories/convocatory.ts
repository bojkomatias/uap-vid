import { Convocatory } from '@prisma/client'
import { cache } from 'react'
import { prisma } from 'utils/bd'

export const getAllConvocatories = cache(async () => {
    try {
        return await prisma.convocatory.findMany()
    } catch (e) {
        return null
    }
})
export const getConvocatoryById = cache(async (id: string) => {
    try {
        return await prisma.convocatory.findFirst({ where: { id } })
    } catch (e) {
        return null
    }
})

// TODO: Make it actually match range from - to
export const getCurrentConvocatory = cache(async () => {
    try {
        return await prisma.convocatory.findFirst({
            where: {
                year: {
                    equals: new Date().getFullYear(),
                },
            },
        })
    } catch (e) {
        return null
    }
})

export const createConvocatory = async (data: Convocatory) => {
    try {
        return await prisma.convocatory.create({
            data,
        })
    } catch (e) {
        return null
    }
}
export const updateConvocatory = async (data: Convocatory) => {
    const { id, ...rest } = data
    try {
        return await prisma.convocatory.update({
            where: { id },
            data: rest,
        })
    } catch (e) {
        return null
    }
}
