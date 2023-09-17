import {
    Prisma,
    type AnualBudget,
    type AnualBudgetTeamMember,
} from '@prisma/client'
import { orderByQuery } from '@utils/query-helper/orderBy'
import { cache } from 'react'
import { prisma } from 'utils/bd'

export const getAnualBudgets = cache(
    async ({
        records = '5',
        page = '1',
        search,
        sort,
        order,
        filter,
        values,
    }: {
        [key: string]: string
    }) => {
        try {
            const orderBy = order && sort ? orderByQuery(sort, order) : {}

            return await prisma.$transaction([
                prisma.anualBudget.count({
                    where: {
                        AND: [
                            search
                                ? {
                                      protocol: {
                                          is: {
                                              sections: {
                                                  is: {
                                                      identification: {
                                                          is: {
                                                              title: {
                                                                  contains:
                                                                      search,
                                                                  mode: Prisma
                                                                      .QueryMode
                                                                      .insensitive,
                                                              },
                                                          },
                                                      },
                                                  },
                                              },
                                          },
                                      },
                                  }
                                : {},
                            filter && values
                                ? { [filter]: { in: values.split('-') } }
                                : {},
                        ],
                    },
                }),

                prisma.anualBudget.findMany({
                    skip: Number(records) * (Number(page) - 1),
                    take: Number(records),

                    where: {
                        AND: [
                            search
                                ? {
                                      protocol: {
                                          is: {
                                              sections: {
                                                  is: {
                                                      identification: {
                                                          is: {
                                                              title: {
                                                                  contains:
                                                                      search,
                                                                  mode: Prisma
                                                                      .QueryMode
                                                                      .insensitive,
                                                              },
                                                          },
                                                      },
                                                  },
                                              },
                                          },
                                      },
                                  }
                                : {},
                            filter && values
                                ? { [filter]: { in: values.split('-') } }
                                : {},
                        ],
                    },
                    select: {
                        id: true,
                        year: true,
                        protocol: true,
                    },

                    orderBy,
                }),
            ])
        } catch (error) {
            return []
        }
    }
)

export const getAnualBudgetById = cache(async (id: string) => {
    try {
        return await prisma.anualBudget.findFirst({
            where: { id },
            select: {
                id: true,
                protocolId: true,
                createdAt: true,
                updatedAt: true,
                year: true,
                budgetTeamMembers: {
                    select: {
                        teamMember: {
                            include: {
                                categories: { include: { category: true } },
                            },
                        },
                        hours: true,
                        remainingHours: true,
                    },
                },
                budgetItems: true,
                protocol: {
                    select: {
                        sections: {
                            select: {
                                identification: {
                                    select: { title: true, sponsor: true },
                                },
                            },
                        },
                    },
                },
            },
        })
    } catch (error) {
        return null
    }
})

export const createAnualBudgetV2 = async (
    data: Omit<AnualBudget, 'id' | 'createdAt' | 'updatedAt'>
) => {
    const newAnualBudget = await prisma.anualBudget.create({ data })
    return newAnualBudget
}

export const createManyAnualBudgetTeamMember = async (
    data: Omit<AnualBudgetTeamMember, 'id'>[]
) => {
    const newAnualBudgetTeamMember =
        await prisma.anualBudgetTeamMember.createMany({ data })
    return newAnualBudgetTeamMember
}

export const createAnualBudget = async (
    data: AnualBudget & { budgetTeamMembers: AnualBudgetTeamMember[] }
) => {
    const { budgetTeamMembers, ...rest } = data
    const newAnualBudget = await prisma.anualBudget.create({
        data: rest,
    })
    await prisma.anualBudgetTeamMember.createMany({
        data: budgetTeamMembers.map((t) => {
            return {
                teamMemberId: t.teamMemberId,
                hours: t.hours,
                remainingHours: t.hours,
                anualBudgetId: newAnualBudget.id,
                executions: [],
            }
        }),
    })
    return newAnualBudget
}

export const updateAnualBudget = async (data: AnualBudget) => {
    const { id, ...rest } = data
    try {
        return await prisma.anualBudget.update({
            where: { id },
            data: rest,
        })
    } catch (e) {
        return null
    }
}

export const getAnualBudgetsByAcademicUnit = cache(
    async (
        ac_unit: string,
        {
            records = '5',
            page = '1',
            search,
            sort,
            order,
            filter,
            values,
        }: {
            [key: string]: string
        }
    ) => {
        try {
            const orderBy = order && sort ? orderByQuery(sort, order) : {}

            return await prisma.$transaction([
                prisma.anualBudget.count({
                    where: {
                        protocol: {
                            is: {
                                sections: {
                                    is: {
                                        identification: {
                                            is: {
                                                sponsor: {
                                                    has: decodeURIComponent(
                                                        ac_unit
                                                    ),
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        AND: [
                            search
                                ? {
                                      protocol: {
                                          is: {
                                              sections: {
                                                  is: {
                                                      identification: {
                                                          is: {
                                                              title: {
                                                                  contains:
                                                                      search,
                                                                  mode: Prisma
                                                                      .QueryMode
                                                                      .insensitive,
                                                              },
                                                          },
                                                      },
                                                  },
                                              },
                                          },
                                      },
                                  }
                                : {},
                            filter && values
                                ? { [filter]: { in: values.split('-') } }
                                : {},
                        ],
                    },
                }),

                prisma.anualBudget.findMany({
                    skip: Number(records) * (Number(page) - 1),
                    take: Number(records),

                    where: {
                        protocol: {
                            is: {
                                sections: {
                                    is: {
                                        identification: {
                                            is: {
                                                sponsor: {
                                                    has: decodeURIComponent(
                                                        ac_unit
                                                    ),
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        AND: [
                            search
                                ? {
                                      protocol: {
                                          is: {
                                              sections: {
                                                  is: {
                                                      identification: {
                                                          is: {
                                                              title: {
                                                                  contains:
                                                                      search,
                                                                  mode: Prisma
                                                                      .QueryMode
                                                                      .insensitive,
                                                              },
                                                          },
                                                      },
                                                  },
                                              },
                                          },
                                      },
                                  }
                                : {},
                            filter && values
                                ? { [filter]: { in: values.split('-') } }
                                : {},
                        ],
                    },
                    select: {
                        id: true,
                        year: true,
                        protocol: true,
                    },

                    orderBy,
                }),
            ])
        } catch (error) {
            return []
        }
    }
)
