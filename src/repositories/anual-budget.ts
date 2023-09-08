import type { AnualBudget } from '@prisma/client'
import { cache } from 'react'
import { prisma } from 'utils/bd'

export const getAnualBudgetById = cache(async (id: string) => {
    try {
        return await prisma.anualBudget.findFirst({
            where: { id },
            select: {
                id: true,
                protocolId: true,
                createdAt: true,
                updatedAt: true,
                year: true,
                budgetTeamMembers: {
                    select: {
                        teamMember: {
                            include: {
                                categories: { include: { category: true } },
                            },
                        },
                        hours: true,
                        remainingHours: true,
                    },
                },
                budgetItems: true,
                protocol: {
                    select: {
                        sections: {
                            select: {
                                identification: {
                                    select: { title: true, sponsor: true },
                                },
                            },
                        },
                    },
                },
            },
        })
    } catch (error) {
        return null
    }
})

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
