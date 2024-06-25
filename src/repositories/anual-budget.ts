'use server'
import { AnualBudgetState, Prisma } from '@prisma/client'
import type {
  AnualBudget,
  AnualBudgetTeamMember,
  AnualBudgetItem,
} from '@prisma/client'
import { orderByQuery } from '@utils/query-helper/orderBy'
import { cache } from 'react'
import { prisma } from 'utils/bd'

export const getAnualBudgets = cache(
  async ({
    records = '10',
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
              search ?
                {
                  protocol: {
                    is: {
                      sections: {
                        is: {
                          identification: {
                            is: {
                              title: {
                                contains: search,
                                mode: Prisma.QueryMode.insensitive,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                }
              : {},
              filter && values ? { [filter]: { in: values.split('-') } } : {},
            ],
          },
        }),

        prisma.anualBudget.findMany({
          skip: Number(records) * (Number(page) - 1),
          take: Number(records),

          where: {
            AND: [
              search ?
                {
                  protocol: {
                    is: {
                      sections: {
                        is: {
                          identification: {
                            is: {
                              title: {
                                contains: search,
                                mode: Prisma.QueryMode.insensitive,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                }
              : {},
              filter && values ? { [filter]: { in: values.split('-') } } : {},
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
      include: {
        protocol: {
          select: {
            state: true,
            sections: {
              select: {
                identification: {
                  select: { title: true, sponsor: true },
                },
                duration: { select: { duration: true } },
              },
            },
          },
        },
        budgetTeamMembers: {
          include: {
            teamMember: {
              include: {
                categories: { include: { category: true } },
              },
            },
          },
        },
        AcademicUnits: true,
      },
    })
  } catch (error) {
    return null
  }
})

export const getAnualBudgetTeamMemberById = cache(async (id: string) => {
  try {
    return await prisma.anualBudgetTeamMember.findFirst({
      where: { id },
      include: {
        teamMember: {
          include: {
            categories: { include: { category: true } },
          },
        },
      },
    })
  } catch (error) {
    return null
  }
})

export const createAnualBudget = async (
  data: Omit<AnualBudget, 'id' | 'createdAt' | 'updatedAt' | 'state'>
) => {
  const newAnualBudget = await prisma.anualBudget.create({ data })

  const promises = data.academicUnitsIds.map(async (id) => {
    await prisma.academicUnit.update({
      where: { id },
      data: {
        AcademicUnitAnualBudgets: {
          connect: { id: newAnualBudget.id },
        },
      },
    })
  })

  await Promise.all(promises)

  return newAnualBudget
}

export const createManyAnualBudgetTeamMember = async (
  data: Omit<AnualBudgetTeamMember, 'id'>[]
) => {
  const newAnualBudgetTeamMember =
    await prisma.anualBudgetTeamMember.createMany({ data })
  return newAnualBudgetTeamMember
}

export const updateAnualBudgetItems = async (
  id: string,
  budgetItems: AnualBudgetItem[]
) => {
  try {
    return await prisma.anualBudget.update({
      where: { id },
      data: { budgetItems },
    })
  } catch (error) {
    return null
  }
}

export const updateAnualBudgetTeamMemberHours = async (
  batch: Omit<
    AnualBudgetTeamMember,
    'teamMemberId' | 'executions' | 'anualBudgetId' | 'memberRole'
  >[]
) => {
  try {
    return await prisma.$transaction(
      batch.map(({ id, ...data }) =>
        prisma.anualBudgetTeamMember.update({ where: { id }, data })
      )
    )
  } catch (error) {
    return null
  }
}

export const getAnualBudgetsByAcademicUnit = cache(
  async (
    {
      records = '10',
      page = '1',
      search,
      sort,
      order,
      filter,
      values,
    }: {
      [key: string]: string
    },
    academicUnitId?: string
  ) => {
    try {
      const orderBy = order && sort ? orderByQuery(sort, order) : {}
      return await prisma.$transaction([
        prisma.anualBudget.count({
          where: {
            AND: [
              filter == 'year' ? { year: { equals: Number(values) } } : {},
              academicUnitId ?
                { academicUnitsIds: { has: academicUnitId } }
              : {},
              search ?
                {
                  protocol: {
                    is: {
                      sections: {
                        is: {
                          identification: {
                            is: {
                              title: {
                                contains: search,
                                mode: Prisma.QueryMode.insensitive,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                }
              : {},
              filter && values && filter != 'year' ?
                { [filter]: { in: values.split('-') } }
              : {},
            ],
          },
        }),

        prisma.anualBudget.findMany({
          skip: Number(records) * (Number(page) - 1),
          take: Number(records),
          where: {
            AND: [
              filter == 'year' ? { year: { equals: Number(values) } } : {},
              academicUnitId ?
                { academicUnitsIds: { has: academicUnitId } }
              : {},

              search ?
                {
                  protocol: {
                    is: {
                      sections: {
                        is: {
                          identification: {
                            is: {
                              title: {
                                contains: search,
                                mode: Prisma.QueryMode.insensitive,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                }
              : {},
              filter && values && filter != 'year' ?
                { [filter]: { in: values.split('-') } }
              : {},
            ],
          },
          select: {
            id: true,
            createdAt: true,
            state: true,
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

export const newTeamMemberExecution = async (
  anualBudgetTeamMemberId: string,
  amount: number,
  remainingHours: number,
  academicUnitId: string
) => {
  return await prisma.anualBudgetTeamMember.update({
    where: { id: anualBudgetTeamMemberId },
    data: {
      executions: { push: { academicUnitId, amount, date: new Date() } },
      remainingHours: remainingHours,
    },
  })
}

export const newBudgetItemExecution = async (
  id: string,
  budgetItems: AnualBudgetItem[]
) => {
  return await prisma.anualBudget.update({
    where: { id },
    data: { budgetItems: budgetItems },
  })
}

export const approveAnualBudget = async (id: string) => {
  return await prisma.anualBudget.update({
    where: { id },
    data: { state: AnualBudgetState.APPROVED },
    select: { id: true, protocol: { select: { id: true, state: true } } },
  })
}

export const rejectAnualBudget = async (id: string) => {
  return await prisma.anualBudget.update({
    where: { id },
    data: { state: AnualBudgetState.REJECTED },
    select: { id: true, protocol: { select: { id: true, state: true } } },
  })
}

export const interruptAnualBudget = async (id: string) => {
  const AB = await prisma.anualBudget.findFirst({
    where: { id },
    select: {
      id: true,
      protocol: { select: { id: true } },
      state: true,
      budgetItems: true,
      budgetTeamMembers: true,
    },
  })
  if (!AB || AB.state !== AnualBudgetState.APPROVED) return
  // Match budget Items amount to execution and remaining 0
  AB.budgetItems.forEach((bi) => {
    bi.amount = bi.executions.reduce((acc, curr) => acc + curr.amount, 0)
    bi.remaining = 0
  })
  // Match only paid hours and remaining to 0
  AB.budgetTeamMembers.forEach((btm) => {
    btm.hours = btm.hours - btm.remainingHours
    btm.remainingHours = 0
  })

  await updateAnualBudgetItems(AB.id, AB.budgetItems)
  await updateAnualBudgetTeamMemberHours(AB.budgetTeamMembers)

  return await prisma.anualBudget.update({
    where: { id },
    data: { state: AnualBudgetState.INTERRUPTED },
    select: { id: true, protocol: { select: { id: true, state: true } } },
  })
}
