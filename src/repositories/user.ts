import type { User } from '@prisma/client'
import { Role } from '@prisma/client'
import { cache } from 'react'
import { prisma } from '../utils/bd'

const getUsers = cache(
    async (
        records: number,
        page: number,
        search?: string,
        order?: string,
        sort?: 'asc' | 'desc'
    ) => {
        try {
            const isCount = order === 'protocols' || order === 'Review'
            return await prisma.$transaction([
                prisma.user.count({
                    where: {
                        name: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                }),
                prisma.user.findMany({
                    skip: records * (page - 1),
                    take: records,
                    // Grab the model, and  bring relational data
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        password: true,
                        role: true,
                        lastLogin: true,
                        image: true,
                        AcademicUnitIds: true,
                        _count: true,
                    },
                    // Add all the globally searchable fields
                    where: search
                        ? {
                              OR: [
                                  {
                                      name: {
                                          contains: search,
                                          mode: 'insensitive',
                                      },
                                  },
                                  {
                                      email: {
                                          contains: search,
                                      },
                                  },
                              ],
                          }
                        : {},
                    // Sort by, distinguishing _count fields from plain fields
                    orderBy:
                        order && sort
                            ? isCount
                                ? { [order]: { _count: sort } }
                                : { [order]: sort }
                            : {},
                }),
            ])
        } catch (error) {
            return []
        }
    }
)

const getAllUsersWithoutResearchers = async () => {
    try {
        const users = await prisma.user.findMany({
            where: {
                role: {
                    not: Role.RESEARCHER,
                },
            },
        })
        return users
    } catch (error) {
        return null
    }
}

const getAllSecretaries = cache(async () => {
    try {
        const secretaries = await prisma.user.findMany({
            where: { role: Role.SECRETARY },
        })
        return secretaries
    } catch (error) {
        return null
    }
})

const findUserById = cache(async (id: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        })
        return user
    } catch (error) {
        return null
    }
})

const findUserByEmail = cache(async (email: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        })
        return user
    } catch (error) {
        return null
    }
})

const updateUserById = async (id: string, data: User) => {
    try {
        const user = await prisma.user.update({
            where: {
                id,
            },
            data,
        })
        return user
    } catch (error) {
        return null
    }
}

const updateUserRoleById = async (id: string, role: Role) => {
    try {
        const user = await prisma.user.update({
            where: {
                id,
            },
            data: { role },
        })
        return user
    } catch (error) {
        return null
    }
}

const updateUserByEmail = async (email: string, data: User) => {
    try {
        const user = await prisma.user.update({
            where: {
                email,
            },
            data,
        })
        return user
    } catch (error) {
        return null
    }
}

const saveUser = async (data: {
    name: string
    email: string
    image?: string | null
    password?: string
    role: Role
    lastLogin?: Date
}) => {
    try {
        const user = await prisma.user.create({
            data,
        })
        return user
    } catch (error) {
        return null
    }
}

const deleteUserById = async (id: string) => {
    try {
        const user = await prisma.user.delete({
            where: {
                id,
            },
        })
        return user.id
    } catch (error) {
        return null
    }
}

export {
    getUsers,
    getAllUsersWithoutResearchers,
    getAllSecretaries,
    findUserById,
    findUserByEmail,
    updateUserById,
    updateUserRoleById,
    updateUserByEmail,
    saveUser,
    deleteUserById,
}
