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

const getTotalRecordsProtocol = cache(async (role: RoleType, id: string) => {
    if (!id) return null

    const query = {
        [ROLE.RESEARCHER]: prisma.protocol.count({
            where: {
                researcherId: id,
                NOT: { state: 'DELETED' },
            },
        }),
        [ROLE.METHODOLOGIST]: prisma.protocol.count({
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
        [ROLE.SCIENTIST]: prisma.protocol.count({
            where: {
                reviews: {
                    some: { reviewerId: id },
                },
                NOT: { state: 'DELETED' },
            },
        }),
    }

    try {
        if (ROLE.ADMIN === role) return prisma.protocol.count({})
        if (role === ROLE.SECRETARY) {
            const academicUnits = await getAcademicUnitsByUserId(id)
            return prisma.protocol.count({
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
                        researcherId: id,
                        NOT: { state: 'DELETED' },
                    },
                }),
                [ROLE.METHODOLOGIST]: prisma.protocol.findMany({
                    skip: shownRecords * (page - 1),
                    take: shownRecords,
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
                    skip: shownRecords * (page - 1),
                    take: shownRecords,
                    where: {
                        reviews: {
                            some: { reviewerId: id },
                        },
                        NOT: { state: 'DELETED' },
                    },
                }),
                [ROLE.ADMIN]: prisma.protocol.findMany({
                    skip: shownRecords * (page - 1),
                    take: shownRecords,
                }),
            }

            if (role === ROLE.SECRETARY) {
                const academicUnits = await getAcademicUnitsByUserId(id)
                return prisma.protocol.findMany({
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

const getProtocolsWithoutPagination = cache(
    async (role: RoleType, id: string) => {
        if (!id) return null

        const query = {
            [ROLE.RESEARCHER]: prisma.protocol.findMany({
                where: {
                    researcherId: id,
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
    getResearcherEmailByProtocolId,
}
