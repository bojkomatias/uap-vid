import {prisma} from '../bd'

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

const updateUserById = async (id: string, data: any) => {
    const user = await prisma.user.update({
        where: {
            id,
        },
        data,
    })
    return user
}

export {getAllUsers, findUserById, updateUserById}