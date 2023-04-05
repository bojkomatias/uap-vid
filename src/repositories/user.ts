import type { User } from '@prisma/client'
import { Role } from '@prisma/client'
import { cache } from 'react'
import { prisma } from '../utils/bd'

const getAllUsers = async () => {
    try {
        const users = await prisma.user.findMany()
        return users
    } catch (error) {
        return null
    }
}

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

const saveUser = async (data: User) => {
    try {
        const user = await prisma.user.create({
            data,
        })
        return user
    } catch (error) {
        return null
    }
}

export {
    getAllUsers,
    getAllUsersWithoutResearchers,
    findUserById,
    findUserByEmail,
    updateUserById,
    updateUserByEmail,
    saveUser,
}
