import type { HistoricTeamMemberCategory, TeamMember } from '@prisma/client'
import { prisma } from '../utils/bd'

export const createTeamMember = async (data: TeamMember) =>
    await prisma.teamMember.create({
        data: { userId: data.userId, name: data.name, obrero: data.obrero },
    })

export const updateTeamMember = async (id: string, data: TeamMember) =>
    await prisma.teamMember.update({
        where: { id },
        data,
    })

export const updateCategoryHistory = async (data: {
    newCategory: string
    expireId: string | undefined
    memberId: string
}) => {
    try {
        if (!data.expireId)
            return await prisma.historicTeamMemberCategory.create({
                data: {
                    categoryId: data.newCategory,
                    teamMemberId: data.memberId,
                    from: new Date(),
                    to: null,
                },
            })
        return await prisma.$transaction([
            prisma.historicTeamMemberCategory.update({
                where: { id: data.expireId },
                data: { to: new Date() },
            }),
            prisma.historicTeamMemberCategory.create({
                data: {
                    categoryId: data.newCategory,
                    teamMemberId: data.memberId,
                    from: new Date(),
                    to: null,
                },
            }),
        ])
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getTeamMemberById = async (id: string) =>
    await prisma.teamMember.findFirstOrThrow({
        where: { id },
        include: { categories: true, user: true },
    })

export const getTeamMembers = async () =>
    await prisma.teamMember.findMany({
        include: {
            user: { select: { id: true, name: true, email: true, role: true } },
            categories: { include: { category: true } },
        },
    })
