'use server'

import { prisma } from '../utils/bd'
import { type Protocol, ProtocolState } from '@prisma/client'
import { cache } from 'react'
import { getAcademicUnitsByUserId } from './academic-unit'
import { orderByQuery } from '@utils/query-helper/orderBy'
import { Prisma, Role } from '@prisma/client'
import AcademicUnitsDictionary from '@utils/dictionaries/AcademicUnitsDictionary'
import { z } from 'zod'
import { IdentificationTeamSchema, ProtocolSchema } from '@utils/zod'
import { getCurrentIndexes } from './finance-index'
import { logProtocolUpdate } from '@utils/logger'

const findProtocolByIdWithResearcher = cache(
  async (id: string) =>
    await prisma.protocol.findUnique({
      where: {
        id,
      },
      include: {
        researcher: { select: { id: true, name: true, email: true } },
        convocatory: { select: { id: true, name: true } },
        anualBudgets: {
          select: { createdAt: true, year: true, id: true },
        },
      },
    })
)
const getProtocolMetadata = cache(
  async (id: string) =>
    await prisma.protocol.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        protocolNumber: true,
        createdAt: true,
        state: true,
        convocatory: { select: { id: true, name: true } },
        researcher: {
          select: { name: true, email: true, id: true, role: true },
        },
        sections: {
          select: { identification: { select: { title: true } } },
        },
      },
    })
)
const findProtocolById = cache(
  async (id: string) =>
    await prisma.protocol.findUnique({
      where: {
        id,
      },
    })
)

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
    const { currentFCA, currentFMR } = await getCurrentIndexes()

    // Parsing the section to have correct formats
    data.sections.identification.team = IdentificationTeamSchema.array().parse(
      data.sections.identification.team
    )

    // Indexing the amount
    data.sections.budget.expenses.forEach((expenseType) => {
      expenseType.data.forEach((expense) => {
        expense.amount = parseFloat(expense.amount as any)
        expense.amountIndex = {
          FCA: expense.amount / currentFCA,
          FMR: expense.amount / currentFMR,
        }
      })
    })

    data.sections.bibliography.chart.forEach((ref) => {
      ref.year = parseInt(ref.year as any)
    })

    return await prisma.protocol.update({
      where: {
        id,
      },
      data,
    })
  } catch (e) {
    console.log(e)
    return null
  }
}

const updateProtocolStateById = async (
  id: string,
  fromState: ProtocolState,
  toState: ProtocolState,
  userId: string
) => {
  try {
    const protocol = await prisma.protocol.update({
      where: {
        id,
      },
      data: {
        state: toState,
      },
      select: {
        id: true,
        state: true,
        sections: { select: { identification: true } },
        researcher: { select: { email: true } },
      },
    })

    await logProtocolUpdate({
      userId,
      fromState,
      toState,
      protocolId: id,
    })

    return {
      status: true,
      data: protocol,
      notification: {
        title: 'Estado modificado',
        message: 'El estado del protocolo fue modificado con éxito',
        intent: 'success',
      } as const,
    }
  } catch (e) {
    return {
      status: false,
      notification: {
        title: 'Error',
        message: 'Ocurrio un error al intentar pasar de estado el protocolo',
        intent: 'error',
      } as const,
    }
  }
}

const patchProtocolNumber = async (id: string, protocolNumber: string) =>
  await prisma.protocol.update({
    where: { id },
    data: { protocolNumber },
    select: { protocolNumber: true },
  })

const createProtocol = async (data: Protocol) => {
  try {
    const { currentFCA, currentFMR } = await getCurrentIndexes()

    // Parsing the section to have correct formats
    data.sections.identification.team = IdentificationTeamSchema.array().parse(
      data.sections.identification.team
    )

    // Indexing the amounts
    data.sections.budget.expenses.forEach((expenseType) => {
      expenseType.data.forEach((expense) => {
        expense.amount = parseFloat(expense.amount as any)
        expense.amountIndex = {
          FCA: expense.amount / currentFCA,
          FMR: expense.amount / currentFMR,
        }
      })
    })

    data.sections.bibliography.chart.forEach((ref) => {
      ref.year = parseInt(ref.year as any)
    })

    const protocol = await prisma.protocol.create({
      data,
    })
    return protocol
  } catch (e) {
    console.log(e)
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

const getProtocolsByRol = cache(
  async (
    role: Role,
    id: string,
    {
      records = '10',
      page = '1',
      search,
      sort,
      order,
      filter,
      values,
      units, // - separated string (FACEA-FCS)
    }: { [key: string]: string }
  ) => {
    if (!id) throw Error('No ID passed')

    // Pagination reusable
    const [skip, take] = [Number(records) * (Number(page) - 1), Number(records)]
    // Select model reusable
    const select = {
      id: true,
      protocolNumber: true,
      state: true,
      logs: {
        include: { user: { select: { name: true } } },
      },
      createdAt: true,
      convocatory: { select: { id: true, name: true, year: true } },
      researcher: {
        select: { id: true, name: true, role: true, email: true },
      },
      reviews: {
        select: {
          id: true,
          updatedAt: true,
          type: true,
          verdict: true,
          reviewer: {
            select: {
              id: true,
              name: true,
              role: true,
              email: true,
            },
          },
        },
      },
      sections: {
        select: {
          identification: true,
          duration: { select: { modality: true, duration: true } },
        },
      },
    }

    // orderBy reusable using the helper function
    const orderBy =
      order && sort ? orderByQuery(sort, order) : { createdAt: 'desc' }

    // Search reusable
    const whereSearch =
      search ?
        {
          OR: [
            {
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
            {
              sections: {
                is: {
                  duration: {
                    is: {
                      modality: {
                        contains: search,
                        mode: Prisma.QueryMode.insensitive,
                      },
                    },
                  },
                },
              },
            },
            {
              researcher: {
                name: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            },
          ],
        }
      : {}
    // filter reusable
    const whereFilter =
      filter && values ? { [filter]: { in: values.split('-') } } : {}

    const whereUnits =
      units ?
        {
          sections: {
            is: {
              identification: {
                is: {
                  sponsor: {
                    hasSome: units
                      .split('-')
                      .map((e) => AcademicUnitsDictionary[e]),
                  },
                },
              },
            },
          },
        }
      : {}

    const queryBuilder = async () => {
      if (role === Role.RESEARCHER)
        return prisma.$transaction([
          prisma.protocol.count({
            where: {
              AND: [
                // According to business logic
                { researcherId: id },
                // According to table features (search, filter)
                whereSearch,
                whereFilter,
              ],
              NOT: { state: ProtocolState.DELETED },
            },
          }),
          prisma.protocol.findMany({
            skip,
            take,
            select,
            orderBy,
            where: {
              AND: [
                // According to business logic
                { researcherId: id },
                // According to table features (search, filter)
                whereSearch,
                whereFilter,
              ],
              NOT: { state: ProtocolState.DELETED },
            },
          }),
        ])
      if (role === Role.METHODOLOGIST || role === Role.SCIENTIST)
        return prisma.$transaction([
          prisma.protocol.count({
            where: {
              AND: [
                {
                  // Business logic
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
                },
                // Table feature
                whereSearch,
                whereFilter,
              ],
              NOT: { state: ProtocolState.DELETED },
            },
          }),
          prisma.protocol.findMany({
            skip,
            take,
            select,
            orderBy,
            where: {
              AND: [
                {
                  // Business logic
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
                },
                // Table feature
                whereSearch,
                whereFilter,
              ],
              NOT: { state: ProtocolState.DELETED },
            },
          }),
        ])
      if (role === Role.SECRETARY) {
        const academicUnits = await getAcademicUnitsByUserId(id)
        return prisma.$transaction([
          prisma.protocol.count({
            where: {
              AND: [
                // Business logic
                {
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
                                hasSome: academicUnits?.map((e) => e.name),
                              },
                            },
                          },
                        },
                      },
                    },
                  ],
                },
                whereSearch,
                whereFilter,
                whereUnits,
              ],

              NOT: { state: ProtocolState.DELETED },
            },
          }),
          prisma.protocol.findMany({
            skip,
            take,
            select,
            orderBy,
            where: {
              AND: [
                // Business logic
                {
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
                                hasSome: academicUnits?.map((e) => e.name),
                              },
                            },
                          },
                        },
                      },
                    },
                  ],
                },
                whereSearch,
                whereFilter,
                whereUnits,
              ],

              NOT: { state: ProtocolState.DELETED },
            },
          }),
        ])
      }
      // else admin
      return prisma.$transaction([
        prisma.protocol.count({
          where: {
            AND: [whereSearch, whereFilter, whereUnits],
          },
        }),
        prisma.protocol.findMany({
          skip,
          take,
          select,
          where: {
            AND: [whereSearch, whereFilter, whereUnits],
          },
          orderBy,
        }),
      ])
    }

    try {
      return await queryBuilder()
    } catch (error) {
      return []
    }
  }
)

export {
  findProtocolById,
  getProtocolMetadata,
  findProtocolByIdWithResearcher,
  updateProtocolById,
  createProtocol,
  getAllProtocols,
  updateProtocolStateById,
  getProtocolsByRol,
  getResearcherEmailByProtocolId,
  patchProtocolNumber,
}
