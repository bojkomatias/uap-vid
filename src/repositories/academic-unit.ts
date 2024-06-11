/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '../utils/bd'
import { cache } from 'react'
import { orderByQuery } from '@utils/query-helper/orderBy'

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

export const getAllAcademicUnits = cache(
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

      const academicUnits = await prisma.$transaction([
        prisma.academicUnit.count({
          where: {
            AND: [
              search
                ? {
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
              search
                ? {
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
/**
 *
 * @param id
 * @param academicUnit can be any shape of academic Units (partials) only pass secretariesIds or only pass budgets works.
 * @returns
 */
export const updateAcademicUnit = async (id: string, academicUnit: any) => {
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
