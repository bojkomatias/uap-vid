import {prisma} from '../bd'

const getAllUsers = async () => {
    const users = await prisma.user.findMany()
    return users
}

export {getAllUsers}