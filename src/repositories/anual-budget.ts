import type { AnualBudget } from '@prisma/client'
import { cache } from 'react'
import { prisma } from 'utils/bd'

export const getAnualBudgetById = cache(
    async (id: string) =>
        await prisma.anualBudget.findFirstOrThrow({
            where: { id },
            select: {
                id: true,
                protocolId: true,
                createdAt: true,
                updatedAt: true,
                year: true,
                budgetTeamMembers: { select: { teamMember: true } },
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
)

export const createAnualBudget = async (data: AnualBudget) =>
    await prisma.anualBudget.create({
        data,
    })

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
