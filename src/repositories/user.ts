import type { User } from '@prisma/client'
import { Role } from '@prisma/client'
import { cache } from 'react'
import { prisma } from '../utils/bd'

/** This query returns all users that match the filtering criteria. The criteria includes:
 
 * @param records this is the amount of records shown in the table at once.
 * @param page necessary for pagination, the total amount of pages is calculated using the records number. Defaults to 1.
 * @param search string that, for now, only searches the name of the user, which is defined as insensitive.
 * @param order this is the key which will be used to order the records.
 * @param sort this is the type of ordering which will be used: asc or desc. Always present when a key is given to the order param.
 *
 */
const getUsers = cache(
    async ({
        records = '8',
        page = '1',
        search,
        order,
        sort,
    }: {
        [key: string]: string
    }) => {
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
                    skip: Number(records) * (Number(page) - 1),
                    take: Number(records),
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
