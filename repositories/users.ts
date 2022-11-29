import {prisma} from '../utils/bd'

const getAllUsers = async () => {
    const users = await prisma.user.findMany()
    return users
}

const findUserById = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
    })
    return user
}

const findUserByEmail = async (email: string) => {
    const user = await prisma.user.findUnique ({
        where: {
            email,
        },
    })
    return user
}

const updateUserById = async (id: string, data: any) => {
    const user = await prisma.user.update({
        where: {
            id,
        },
        data,
    })
    return user
}

const updateUserByEmail = async (email: string, data: any) => {
    const user = await prisma.user.update({
        where: {
            email,
        },
        data,
    })
    return user
}

const saveUser = async (data: any) => {
    const user = await prisma.user.create({
        data,
    })
    return user
}

export {getAllUsers, findUserById, findUserByEmail, updateUserById, updateUserByEmail, saveUser}