import type { TeamMember } from '@prisma/client'
import { prisma } from '../utils/bd'
import { orderByQuery } from '@utils/query-helper/orderBy'

export const createTeamMember = async (data: TeamMember) =>
    await prisma.teamMember.create({
        data,
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
        return null
    }
}

export const getTeamMemberById = async (id: string) =>
    await prisma.teamMember.findFirstOrThrow({
        where: { id },
        include: { categories: true, user: true },
    })

export const getTeamMemberCategoriesById = async (teamMemberIds: string[]) =>
    await prisma.teamMember.findFirstOrThrow({
        where: {
            id: {
                in: teamMemberIds,
            },
        },
        include: {
            categories: {
                include: { category: true },
            },
        },
    })

export const getTeamMembersByIds = async (teamMemberIds: string[]) =>
    await prisma.teamMember.findMany({
        where: {
            id: {
                in: teamMemberIds
            }
        },
        include: {
            user: true
        }
    })

export const getTeamMembers = async ({
    records = '5',
    page = '1',
    search,
    sort,
    order,
    filter,
    values,
}: {
    [key: string]: string
}) => {
    const orderBy = order && sort ? orderByQuery(sort, order) : {}

    return await prisma.$transaction([
        prisma.teamMember.count(),
        prisma.teamMember.findMany({
            skip: Number(records) * (Number(page) - 1),
            take: Number(records),
            include: {
                user: {
                    select: { id: true, name: true, email: true, role: true },
                },
                categories: { include: { category: true } },
            },
            where: search
                ? {
                    OR: [{ name: { contains: search, mode: 'insensitive' } }],
                }
                : {},

            orderBy,
        }),
    ])
}

export const getAllTeamMembers = async () => await prisma.teamMember.findMany()
