'use server'

import { AnualBudgetState, Prisma, ProtocolState } from '@prisma/client'
import type {
  AnualBudget,
  AnualBudgetTeamMember,
  AnualBudgetItem,
  AmountIndex,
} from '@prisma/client'
import { sumAmountIndex, ZeroAmountIndex } from '@utils/amountIndex'
import { orderByQuery } from '@utils/query-helper/orderBy'
import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import { getServerSession } from 'next-auth'
import { cache } from 'react'
import { prisma } from 'utils/bd'
import { logEvent } from './log'

export const getAnualBudgetYears = cache(async () => {
  return await prisma.anualBudget.findMany({ select: { year: true } })
})

export const getAnualBudgets = cache(
  async ({
    records = '10',
    page = '1',
    search,
    sort,
    order,
    year,
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
              year ? { year: parseInt(year) } : {},
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
              year ? { year: parseInt(year) } : {},
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
            id: true,
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
            category: true,
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
    | 'teamMemberId'
    | 'executions'
    | 'anualBudgetId'
    | 'memberRole'
    | 'categoryId'
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
      console.log(error)
      return []
    }
  }
)

export const newTeamMemberExecution = async (
  anualBudgetTeamMemberId: string,
  amountIndex: AmountIndex,
  remainingHours: number,
  academicUnitId: string
) => {
  return await prisma.anualBudgetTeamMember.update({
    where: { id: anualBudgetTeamMemberId },
    data: {
      executions: { push: { academicUnitId, amountIndex, date: new Date() } },
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
  try {
    const session = await getServerSession(authOptions)
    const result = await prisma.anualBudget.update({
      where: { id },
      data: {
        state: AnualBudgetState.APPROVED,
        protocol: { update: { state: ProtocolState.ON_GOING } },
      },
      select: { id: true, protocolId: true },
    })

    await logEvent({
      userId: session!.user.id,
      protocolId: result.protocolId,
      budgetId: result.id,
      action: 'APPROVE',
      message: null,
      reviewerId: null,
      previousState: ProtocolState.ACCEPTED,
    })
    return result
  } catch (e) {
    return null
  }
}

export const rejectAnualBudget = async (id: string) => {
  try {
    const session = await getServerSession(authOptions)

    const result = await prisma.anualBudget.update({
      where: { id },
      data: {
        state: AnualBudgetState.REJECTED,
        protocol: { update: { state: ProtocolState.DISCONTINUED } },
      },
      select: { id: true, protocolId: true },
    })

    await logEvent({
      userId: session!.user.id,
      protocolId: result.protocolId,
      budgetId: result.id,
      action: 'DISCONTINUE',
      message: null,
      reviewerId: null,
      previousState: ProtocolState.ACCEPTED,
    })
    return result
  } catch (e) {
    return null
  }
}

export const interruptAnualBudget = async (id: string) => {
  try {
    const session = await getServerSession(authOptions)
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
      bi.amountIndex = sumAmountIndex(
        bi.executions.map((x) => x.amountIndex).filter(Boolean) as AmountIndex[]
      )
      bi.remainingIndex = ZeroAmountIndex
    })
    // Match only paid hours and remaining to 0
    AB.budgetTeamMembers.forEach((btm) => {
      btm.hours = btm.hours - btm.remainingHours
      btm.remainingHours = 0
    })

    await updateAnualBudgetItems(AB.id, AB.budgetItems)
    await updateAnualBudgetTeamMemberHours(AB.budgetTeamMembers)

    const result = await prisma.anualBudget.update({
      where: { id },
      data: {
        state: AnualBudgetState.INTERRUPTED,
        protocol: { update: { state: ProtocolState.DISCONTINUED } },
      },
      select: { id: true, protocolId: true },
    })

    await logEvent({
      userId: session!.user.id,
      protocolId: result.protocolId,
      budgetId: result.id,
      action: 'DISCONTINUE',
      message: null,
      reviewerId: null,
      previousState: ProtocolState.ON_GOING,
    })
  } catch (e) {
    return null
  }
}

export const reactivatedAnualBudget = async (id: string) => {
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
  if (!AB || AB.state !== AnualBudgetState.INTERRUPTED) return

  await prisma.anualBudget.update({
    where: { id },
    data: { state: AnualBudgetState.APPROVED },
    select: { id: true, protocol: { select: { id: true, state: true } } },
  })

  return prisma.protocol.update({
    where: { id: AB.protocol.id },
    data: { state: ProtocolState.ON_GOING },
  })
}
