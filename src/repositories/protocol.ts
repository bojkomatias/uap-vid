import { prisma } from '../utils/bd'

const findProtocolById = async (id: string) => {
    try {
        return await prisma.protocol.findUnique({
            where: {
                id,
            },
        })
    } catch (e) {
        console.log(e)
        return null 
    }
}

const updateProtocolById = async (id: string, data: any) => {
    try {
        const protocol = await prisma.protocol.update({
            where: {
                id,
            },
            data,
        })
        return protocol
    }
    catch (e) {
        console.log(e)
        return null
    }
}

const createProtocol = async (data: any) => {
    try {
        const protocol = await prisma.protocol.create({
            data,
        })
        return protocol
    }
    catch (e) {
        console.log(e)
        return null
    }
}

const getAllProtocols = async () => {
    try {
        return await prisma.protocol.findMany()
    }
    catch (e) {
        console.log(e)
        return null
    }
}

const protocolByResearcher = (researcherId: string) => {
    try {
        return prisma.protocol.findMany({
            where: {
                researcher: {
                    equals: researcherId,
                },
            },
        })
    }
    catch (e) {
        console.log(e)
        return null
    }
}
export { findProtocolById, updateProtocolById, createProtocol, getAllProtocols }
