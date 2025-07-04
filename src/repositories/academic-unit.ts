'use server'

import { prisma } from '../utils/bd'
import { cache } from 'react'
import { orderByQuery } from '@utils/query-helper/orderBy'
import type { z } from 'zod'
import type { AcademicUnitSchema } from '@utils/zod'
import type { Secretary } from 'modules/academic-unit/edit-secretaries-form'
import { getCurrentIndexes } from './finance-index'

export const getAcademicUnitsNameAndShortname = cache(
  async () =>
    await prisma.academicUnit.findMany({
      select: {
        id: true,
        name: true,
        shortname: true,
      },
    })
)

export const getAcademicUnitsTabs = cache(
  async () =>
    await prisma.academicUnit.findMany({
      select: {
        id: true,
        name: true,
        shortname: true,
        _count: { select: { AcademicUnitAnualBudgets: true } },
      },
    })
)

export const getAcademicUnitByIdWithoutIncludes = async (id: string) => {
  try {
    return prisma.academicUnit.findUnique({
      where: {
        id,
      },
    })
  } catch (error) {
    return null
  }
}

export const getAcademicUnitById = async (id?: string) => {
  try {
    if (!id)
      return prisma.academicUnit.findMany({
        include: {
          AcademicUnitAnualBudgets: {
            include: {
              budgetTeamMembers: {
                include: {
                  teamMember: {
                    include: {
                      categories: {
                        include: { category: true },
                      },
                    },
                  },
                  category: true,
                },
              },
            },
          },
        },
      })

    return prisma.academicUnit.findMany({
      where: {
        id,
      },
      include: {
        AcademicUnitAnualBudgets: {
          include: {
            budgetTeamMembers: {
              include: {
                teamMember: {
                  include: {
                    categories: {
                      include: { category: true },
                    },
                  },
                },
                category: true,
              },
            },
          },
        },
      },
    })
  } catch (error) {
    return null
  }
}

export const getAcademicUnitWithSecretariesById = async (id: string) => {
  return await prisma.academicUnit.findFirst({
    where: { id },
    select: {
      id: true,
      name: true,
      shortname: true,
      secretaries: {
        select: { id: true, name: true, email: true },
      },
    },
  })
}

export const getAllAcademicUnits = cache(
  async ({
    records = '10',
    page = '1',
    search,
    sort,
    order,
  }: {
    [key: string]: string
  }) => {
    try {
      const orderBy = order && sort ? orderByQuery(sort, order) : {}

      const academicUnits = await prisma.$transaction([
        prisma.academicUnit.count({
          where: {
            AND: [
              search ?
                {
                  OR: [
                    {
                      name: {
                        contains: search,
                        mode: 'insensitive',
                      },
                    },
                  ],
                }
              : {},
            ],
          },
        }),

        prisma.academicUnit.findMany({
          skip: Number(records) * (Number(page) - 1),
          take: Number(records),
          // Grab the model, and  bring relational data
          select: {
            id: true,
            name: true,
            shortname: true,
            budgets: true,
            secretariesIds: true,
            academicUnitAnualBudgetsIds: true,
          },
          // Add all the globally searchable fields
          where: {
            AND: [
              search ?
                {
                  OR: [
                    {
                      name: {
                        contains: search,
                        mode: 'insensitive',
                      },
                    },
                  ],
                }
              : {},
            ],
          },
          orderBy,
        }),
      ])

      // const academicUnits = await prisma.academicUnit.findMany({
      //     include: { secretaries: true },
      // })
      return academicUnits
    } catch (error) {
      return []
    }
  }
)

export const getAcademicUnitsByUserId = async (id: string) => {
  try {
    const academicUnits = prisma.academicUnit.findMany({
      where: {
        secretariesIds: {
          has: id,
        },
      },
    })
    return academicUnits
  } catch (error) {
    return null
  }
}

export const upsertAcademicUnit = async (
  academicUnit: z.infer<typeof AcademicUnitSchema>
) => {
  const { id, ...rest } = academicUnit
  try {
    if (!id)
      return await prisma.academicUnit.create({
        data: academicUnit,
      })

    return await prisma.academicUnit.update({ where: { id }, data: rest })
  } catch (error) {
    console.info(error)
    return null
  }
}

export const updateAcademicUnitBudget = async (
  id: string,
  newValue: number
) => {
  try {
    // Pull values
    const { currentFCA, currentFMR } = await getCurrentIndexes()

    // Get the current budgets
    const { budgets } = await prisma.academicUnit.findFirstOrThrow({
      where: { id },
      select: { budgets: true },
    })

    if (budgets.length > 0) {
      // If has budget, end the period of the last one
      budgets.at(-1)!.to = new Date()
    }
    // Append the new one
    budgets.push({
      from: new Date(),
      to: null,
      amount: null,
      amountIndex: { FCA: newValue / currentFCA, FMR: newValue / currentFMR },
    })
    // update the array in the db
    const result = await prisma.academicUnit.update({
      where: { id },
      data: { budgets },
    })

    return result
  } catch (error) {
    console.info(error)
    return null
  }
}

export const updateAcademicUnitSecretaries = async (
  id: string,
  secretaries: Secretary[]
) => {
  try {
    const unit = await prisma.academicUnit.update({
      where: {
        id,
      },
      data: { secretariesIds: secretaries.map((e) => e.id) },
    })
    return unit
  } catch (error) {
    return null
  }
}

export const getSecretariesEmailsByAcademicUnit = async (id: string) => {
  try {
    const academicUnits = prisma.academicUnit.findMany({
      where: {
        id: id,
      },
      select: {
        secretaries: {
          select: {
            email: true,
          },
        },
      },
    })
    return academicUnits
  } catch (error) {
    return null
  }
}
