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
          budgets: {
            orderBy: { year: 'desc' },
          },
          AcademicUnitAnualBudgets: {
            include: {
              budgetItems: {
                include: {
                  executions: {
                    include: {
                      academicUnit: true,
                    },
                  },
                },
              },
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
                  executions: {
                    include: {
                      academicUnit: true,
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
        budgets: {
          orderBy: { year: 'desc' },
        },
        AcademicUnitAnualBudgets: {
          include: {
            budgetItems: {
              include: {
                executions: {
                  include: {
                    academicUnit: true,
                  },
                },
              },
            },
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
                executions: {
                  include: {
                    academicUnit: true,
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

// NEW: Get academic unit with its budgets
export const getAcademicUnitWithBudgetsById = async (id: string) => {
  return await prisma.academicUnit.findFirst({
    where: { id },
    select: {
      id: true,
      name: true,
      shortname: true,
      budgets: {
        orderBy: { year: 'desc' },
        select: {
          id: true,
          year: true,
          amountIndex: true,
          from: true,
          to: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  })
}

// NEW: Get current budget for an academic unit (latest year)
export const getCurrentBudgetForAcademicUnit = async (id: string) => {
  const currentYear = new Date().getFullYear()

  return await prisma.academicUnitBudget.findFirst({
    where: {
      academicUnitId: id,
      year: { in: [currentYear, currentYear - 1] }, // Try current year, fall back to previous
    },
    orderBy: { year: 'desc' },
  })
}

// NEW: Get budget for specific academic unit and year
export const getBudgetForAcademicUnitAndYear = async (
  academicUnitId: string,
  year: number
) => {
  return await prisma.academicUnitBudget.findUnique({
    where: {
      academicUnitId_year: {
        academicUnitId,
        year,
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
          select: {
            id: true,
            name: true,
            shortname: true,
            // Updated: Now includes the new budget relation
            budgets: {
              orderBy: { year: 'desc' },
              take: 1, // Get only the most recent budget for listing
              select: {
                year: true,
                amountIndex: true,
              },
            },
            secretariesIds: true,
            academicUnitAnualBudgetsIds: true,
          },
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
    if (!id) {
      // When creating a new academic unit, also create default budgets
      const newUnit = await prisma.academicUnit.create({
        data: academicUnit,
      })

      // Create default budgets for 2024 and 2025
      await createDefaultBudgetsForAcademicUnit(newUnit.id)

      return newUnit
    }

    return await prisma.academicUnit.update({ where: { id }, data: rest })
  } catch (error) {
    console.info(error)
    return null
  }
}

// NEW: Create default budgets for a new academic unit
export const createDefaultBudgetsForAcademicUnit = async (
  academicUnitId: string
) => {
  const defaultAmountIndex = { FCA: 20, FMR: 20 }
  const requiredYears = [2024, 2025]

  const budgetPromises = requiredYears.map((year) =>
    prisma.academicUnitBudget.upsert({
      where: {
        academicUnitId_year: {
          academicUnitId,
          year,
        },
      },
      update: {}, // Don't update if exists
      create: {
        academicUnitId,
        year,
        amountIndex: defaultAmountIndex,
        from: new Date(`${year}-01-01`),
        to: new Date(`${year}-12-31`),
      },
    })
  )

  return await Promise.all(budgetPromises)
}

// UPDATED: New budget update function for the new model
export const updateAcademicUnitBudget = async (
  academicUnitId: string,
  year: number,
  newValue: number
) => {
  try {
    // Pull current indexes
    const { currentFCA, currentFMR } = await getCurrentIndexes()

    // Calculate the new amount index
    const newAmountIndex = {
      FCA: newValue / currentFCA,
      FMR: newValue / currentFMR,
    }

    // Update or create the budget for the specific year
    const result = await prisma.academicUnitBudget.upsert({
      where: {
        academicUnitId_year: {
          academicUnitId,
          year,
        },
      },
      update: {
        amountIndex: newAmountIndex,
        updatedAt: new Date(),
      },
      create: {
        academicUnitId,
        year,
        amountIndex: newAmountIndex,
        from: new Date(`${year}-01-01`),
        to: new Date(`${year}-12-31`),
      },
    })

    return result
  } catch (error) {
    console.info(error)
    return null
  }
}

// NEW: Update budget for current year (convenience function)
export const updateCurrentYearBudget = async (
  academicUnitId: string,
  newValue: number
) => {
  const currentYear = new Date().getFullYear()
  return updateAcademicUnitBudget(academicUnitId, currentYear, newValue)
}

// NEW: Get budget value in current currency for a specific year
export const getBudgetValueForYear = async (
  academicUnitId: string,
  year: number
): Promise<number | null> => {
  try {
    const budget = await getBudgetForAcademicUnitAndYear(academicUnitId, year)
    if (!budget) return null

    const { currentFCA, currentFMR } = await getCurrentIndexes()

    // Calculate current value using FCA (you might want to make this configurable)
    return budget.amountIndex.FCA * currentFCA
  } catch (error) {
    console.info(error)
    return null
  }
}

// NEW: Get all budget values for an academic unit
export const getAllBudgetValuesForAcademicUnit = async (
  academicUnitId: string
) => {
  try {
    const budgets = await prisma.academicUnitBudget.findMany({
      where: { academicUnitId },
      orderBy: { year: 'desc' },
    })

    const { currentFCA, currentFMR } = await getCurrentIndexes()

    return budgets.map((budget) => ({
      ...budget,
      currentValueFCA: budget.amountIndex.FCA * currentFCA,
      currentValueFMR: budget.amountIndex.FMR * currentFMR,
    }))
  } catch (error) {
    console.info(error)
    return []
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

// NEW: Helper function to ensure academic unit has required budgets
export const ensureAcademicUnitHasRequiredBudgets = async (
  academicUnitId: string
) => {
  const requiredYears = [2024, 2025]
  const existingBudgets = await prisma.academicUnitBudget.findMany({
    where: { academicUnitId },
    select: { year: true },
  })

  const existingYears = existingBudgets.map((b) => b.year)
  const missingYears = requiredYears.filter(
    (year) => !existingYears.includes(year)
  )

  if (missingYears.length > 0) {
    await createDefaultBudgetsForAcademicUnit(academicUnitId)
  }

  return missingYears.length
}