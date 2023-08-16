import { prisma } from '../utils/bd'
import type { RoleType, StateType } from '@utils/zod'
import { ROLE } from '@utils/zod'
import type { Protocol } from '@prisma/client'
import { cache } from 'react'
import { getAcademicUnitsByUserId } from './academic-unit'

const findProtocolById = cache(async (id: string) => {
    try {
        return await prisma.protocol.findUnique({
            where: {
                id,
            },
        })
    } catch (e) {
        return null
    }
})

const getResearcherEmailByProtocolId = cache(async (id: string) => {
    try {
        return await prisma.protocol.findUnique({
            select: {
                researcher: {
                    select: {
                        email: true,
                    },
                },
            },
            where: {
                id,
            },
        })
    } catch (e) {
        return null
    }
})

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
        return null
    }
}

const getAllProtocols = cache(async () => {
    try {
        return await prisma.protocol.findMany()
    } catch (e) {
        return null
    }
})

const getProtocolByRol = cache(
    async (
        role: RoleType,
        id: string,
        {
            records = '8',
            page = '1',
            search,
            order,
            sort,
        }: { [key: string]: string }
    ) => {
        if (!id) return null

        const [skip, take] = [
            Number(records) * (Number(page) - 1),
            Number(records),
        ]
        const select = {}
        const queryBuilder = async () => {
            const query = {
                [ROLE.RESEARCHER]: prisma.protocol.findMany({
                    skip,
                    take,
                    where: {
                        AND: [{ researcherId: id }, {OR:[]}],
                        NOT: { state: 'DELETED' },
                    },
                    select
                }),
                [ROLE.METHODOLOGIST]: prisma.protocol.findMany({
                    skip,
                    take,
                    where: {
                        OR: [
                            {
                                researcherId: id,
                            },
                            {
                                reviews: {
                                    some: { reviewerId: id },
                                },
                            },
                        ],
                        NOT: { state: 'DELETED' },
                    },
                }),
                [ROLE.SCIENTIST]: prisma.protocol.findMany({
                    skip,
                    take,
                    where: {
                        reviews: {
                            some: { reviewerId: id },
                        },
                        NOT: { state: 'DELETED' },
                    },
                }),
                [ROLE.ADMIN]: prisma.protocol.findMany({
                    skip,
                    take,
                    select: { convocatory: {} },
                }),
            }

            if (role === ROLE.SECRETARY) {
                const academicUnits = await getAcademicUnitsByUserId(id)
                return prisma.protocol.findMany({
                    skip,
                    take,
                    where: {
                        OR: [
                            {
                                researcherId: id,
                            },
                            {
                                sections: {
                                    is: {
                                        identification: {
                                            is: {
                                                sponsor: {
                                                    hasSome: academicUnits?.map(
                                                        (e) => e.name
                                                    ),
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        ],
                        NOT: { state: 'DELETED' },
                    },
                })
            }
            return query[role]
        }

        try {
            return await queryBuilder()
        } catch (e) {
            return null
        }
    }
)

export {
    findProtocolById,
    updateProtocolById,
    createProtocol,
    getAllProtocols,
    updateProtocolStateById,
    getProtocolByRol,
    getResearcherEmailByProtocolId,
}
