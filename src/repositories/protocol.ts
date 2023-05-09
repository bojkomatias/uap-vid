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

const getTotalRecordsProtocol = cache(async (role: RoleType, id: string) => {
    if (!id) return null

    const query = {
        [ROLE.RESEARCHER]: prisma.protocol.count({
            where: {
                researcher: id,
            },
        }),
        [ROLE.METHODOLOGIST]: prisma.review.count({
            where: {
                reviewerId: id,
                type: 'METHODOLOGICAL',
            },
        }),
        [ROLE.SCIENTIST]: prisma.review.count({
            where: {
                reviewerId: id,
                type: {
                    in: ['SCIENTIFIC_EXTERNAL', 'SCIENTIFIC_INTERNAL'],
                },
            },
        }),
    }

    try {
        if (ROLE.ADMIN === role || ROLE.SECRETARY === role)
            return prisma.protocol.count({})

        return await query[role]
    } catch (e) {
        return null
    }
})

const getProtocolByRol = cache(
    async (role: RoleType, id: string, page: number, shownRecords: number) => {
        if (!id) return null

        const queryBuilder = async () => {
            const query = {
                [ROLE.RESEARCHER]: prisma.protocol.findMany({
                    skip: shownRecords * (page - 1),
                    take: shownRecords,
                    where: {
                        researcher: id,
                    },
                }),
                [ROLE.METHODOLOGIST]: prisma.review
                    .findMany({
                        skip: shownRecords * (page - 1),
                        take: shownRecords,
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
                        skip: shownRecords * (page - 1),
                        take: shownRecords,
                        select: {
                            protocol: true,
                        },
                        where: {
                            reviewerId: id,
                            type: {
                                in: [
                                    'SCIENTIFIC_EXTERNAL',
                                    'SCIENTIFIC_INTERNAL',
                                ],
                            },
                        },
                    })
                    .then((result) => result.map((item) => item.protocol)),
                [ROLE.ADMIN]: prisma.protocol.findMany({
                    skip: shownRecords * (page - 1),
                    take: shownRecords,
                }),
            }

            if (role === ROLE.SECRETARY) {
                const academicUnits = await getAcademicUnitsByUserId(id)
                return prisma.protocol.findMany({
                    where: {
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

const getProtocolsWithoutPagination = cache(
    async (role: RoleType, id: string) => {
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
                return prisma.protocol.findMany({})

            return await query[role]
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
    getTotalRecordsProtocol,
    getProtocolsWithoutPagination,
}
