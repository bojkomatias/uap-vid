'use server'

import { prisma } from '../utils/bd'
import { cache } from 'react'
import { orderByQuery } from '@utils/query-helper/orderBy'
import { AcademicUnit } from '@prisma/client'
import { z } from 'zod'
import { AcademicUnitSchema } from '@utils/zod'

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
    filter,
    values,
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
              filter && values ? { [filter]: { in: values.split('-') } } : {},
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
              filter && values ? { [filter]: { in: values.split('-') } } : {},
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
    const [FCAValues, FMRValues] = await prisma.$transaction([
      prisma.index.findFirstOrThrow({
        where: { unit: 'FCA' },
        select: { values: true },
      }),
      prisma.index.findFirstOrThrow({
        where: { unit: 'FMR' },
        select: { values: true },
      }),
    ])

    const [currentFCA, currentFMR] = [
      FCAValues.values.at(-1)?.price,
      FMRValues.values.at(-1)?.price,
    ]

    if (!currentFCA || !currentFMR)
      throw Error('There are no FCA / FMR indexes')

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

/**
 *
 * @param id
 * @param academicUnit can be any shape of academic Units (partials) only pass secretariesIds or only pass budgets works.
 * @returns
 */
export const updateAcademicUnit = async (
  id: string,
  academicUnit: Omit<AcademicUnit, 'id'>
) => {
  try {
    const unit = await prisma.academicUnit.update({
      where: {
        id,
      },
      data: academicUnit,
    })
    return unit
  } catch (error) {
    return null
  }
}

export const getSecretariesEmailsByAcademicUnit = async (name: string) => {
  try {
    const academicUnits = prisma.academicUnit.findMany({
      where: {
        name: {
          contains: name,
        },
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
