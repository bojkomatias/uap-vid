import { cache } from 'react'
import { prisma } from '../utils/bd'

const getAllUsers = async () => {
    try {
        const users = await prisma.user.findMany()
        return users
    } catch (error) {
        console.log(error)
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
        console.log(error)
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
        console.log(error)
        return null
    }
})

const updateUserById = async (id: string, data: any) => {
    try {
        const user = await prisma.user.update({
            where: {
                id,
            },
            data,
        })
        return user
    } catch (error) {
        console.log(error)
        return null
    }
}

const updateUserByEmail = async (email: string, data: any) => {
    try {
        const user = await prisma.user.update({
            where: {
                email,
            },
            data,
        })
        return user
    } catch (error) {
        console.log(error)
        return null
    }
}

const saveUser = async (data: any) => {
    try {
        const user = await prisma.user.create({
            data,
        })
        return user
    } catch (error) {
        console.log(error)
        return null
    }
}

export {
    getAllUsers,
    findUserById,
    findUserByEmail,
    updateUserById,
    updateUserByEmail,
    saveUser,
}
