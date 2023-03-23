import { prisma } from '../utils/bd'
import { ROLE, RoleType, StateType } from '@utils/zod'
import { Protocol } from '@prisma/client'

const findProtocolById = async (id: string, withReviews: boolean) => {
    try {
        return await prisma.protocol.findUnique({
            include: {
                reviews: withReviews,
            },
            where: {
                id,
            }
        })
    } catch (e) {
        console.log(e)
        return null
    }
}

const updateProtocolById = async (id: string, data: Protocol) => {
    try {
        const protocol = await prisma.protocol.update({
            where: {
                id,
            },
            data,
        })
        return protocol
    } catch (e) {
        console.log(e)
        return null
    }
}

const updateProtocolStateById = async (id: string, state: StateType) => {
    try {
        const protocol = await prisma.protocol.update({
            where: {
                id,
            },
            data: {
                state: state,
            },
        })
        return protocol
    } catch (e) {
        console.log(e)
        return null
    }
}

const createProtocol = async (data: Protocol) => {
    try {
        const protocol = await prisma.protocol.create({
            data,
        })
        return protocol
    } catch (e) {
        console.log(e)
        return null
    }
}

const getAllProtocols = async () => {
    try {
        return await prisma.protocol.findMany()
    } catch (e) {
        console.log(e)
        return null
    }
}

const getProtocolByRol = async (role: RoleType, id: string) => {
    if (!id) return null

    const query = {
        [ROLE.RESEARCHER]: prisma.protocol.findMany({
            where: {
                researcher: id,
            },
        }),
        [ROLE.METHODOLOGIST]: prisma.review
            .findMany({
                select: {
                    protocol: true,
                },
                where: {
                    reviewerId: id,
                    type: 'METHODOLOGICAL',
                },
            })
            .then((result) => result.map((item) => item.protocol)),
        [ROLE.SCIENTIST]: prisma.review
            .findMany({
                select: {
                    protocol: true,
                },
                where: {
                    reviewerId: id,
                    type: 'SCIENTIFIC_EXTERNAL',
                },
            })
            .then((result) => result.map((item) => item.protocol)),
    }

    try {
        if (ROLE.ADMIN === role || ROLE.SECRETARY === role)
            return prisma.protocol.findMany()
        return await query[role]
    } catch (e) {
        console.log(e)
        return null
    }
}
export {
    findProtocolById,
    updateProtocolById,
    createProtocol,
    getAllProtocols,
    updateProtocolStateById,
    getProtocolByRol,
}
