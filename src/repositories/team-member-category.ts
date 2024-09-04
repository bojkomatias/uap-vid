'use server'

import type { AmountIndex, TeamMemberCategory } from '@prisma/client'
import { cache } from 'react'
import { prisma } from '../utils/bd'
import { orderByQuery } from '@utils/query-helper/orderBy'
import { TeamMemberCategorySchema } from '@utils/zod'
import { getCurrentIndexes } from './finance-index'
import { z } from 'zod'

/** This query returns all categories that match the filtering criteria. The criteria includes:

 * @param records this is the amount of records shown in the table at once.
 * @param page necessary for pagination, the total amount of pages is calculated using the records number. Defaults to 1.
 * @param search string that, for now, only searches the name of the category, which is defined as insensitive.
 * @param sort this is the key which will be used to order the records.
 * @param order this is the type of ordering which will be used: asc or desc. Always present when a key is given to the order param.
 *
 */

const getCategoriesForForm = cache(async () => {
  try {
    return await prisma.teamMemberCategory.findMany({})
  } catch (e) {
    console.log(e)
    return []
  }
})

const getCategories = cache(
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

      return await prisma.$transaction([
        prisma.teamMemberCategory.count({
          where: {
            state: { not: false },
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

        prisma.teamMemberCategory.findMany({
          skip: Number(records) * (Number(page) - 1),
          take: Number(records),
          // Grab the model, and  bring relational data
          select: {
            id: true,
            state: true,
            name: true,
            price: true,
            amountIndex: true,
            specialCategory: true,
            historicAmountIndexes: true,
          },
          // Add all the globally searchable fields
          where: {
            state: { not: false },
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
    } catch (error) {
      return []
    }
  }
)

const updatePriceCategoryById = async (
  id: string,
  data: TeamMemberCategory
) => {
  try {
    const category = await prisma.teamMemberCategory.update({
      where: {
        id,
      },
      data: { price: data.price },
    })
    return category
  } catch (error) {
    return new Error(`${error}`)
  }
}

const deleteCategoryById = async (id: string, data: TeamMemberCategory) => {
  try {
    const user = await prisma.teamMemberCategory.update({
      where: {
        id,
      },
      data: { state: data.state },
    })
    return user
  } catch (error) {
    return new Error(`${error}`)
  }
}

const insertCategory = async (
  data: z.infer<typeof TeamMemberCategorySchema>
) => {
  const { currentFCA, currentFMR } = await getCurrentIndexes()
  try {
    console.log('Inserting category')
    console.log(data.specialCategory)

    const created = await prisma.teamMemberCategory.create({
      data: {
        name: data.name,
        state: data.state,
        specialCategory: data.specialCategory,
        amountIndex: {
          FCA: data.amount / currentFCA,
          FMR: data.amount / currentFMR,
        },
        // push the new amount index to the historic array
        historicAmountIndexes: [
          {
            from: new Date(),
            amountIndex: {
              FCA: data.amount / currentFCA,
              FMR: data.amount / currentFMR,
            },
          },
        ],
      },
    })
    return created
  } catch (error) {
    console.log(error)
    return null
  }
}

const getNewHistoricAmountIndex = (
  oldCategory: TeamMemberCategory,
  newAmountIndex: AmountIndex
) => {
  const oldHistoricAmountIndexes = oldCategory.historicAmountIndexes.map(
    (item) => {
      if (!item.to) {
        return {
          ...item,
          to: new Date(),
        }
      }
      return item
    }
  )
  const newHistoricAmountIndex = [
    ...oldHistoricAmountIndexes,
    {
      from: new Date(),
      amountIndex: newAmountIndex,
    },
  ]
  return newHistoricAmountIndex
}

export async function recalculateSpecialCategories(
  unit: 'FCA' | 'FMR',
  oldIndexValue: number,
  newIndexValue: number
) {
  try {
    const specialTeamMembers = await prisma.teamMemberCategory.findMany({
      where: { specialCategory: true },
    })

    const updatedCategories = specialTeamMembers.map((category) => {
      const newAmountIndex = {
        ...category.amountIndex,
        [unit]: (category.amountIndex[unit] * oldIndexValue) / newIndexValue,
      }
      return {
        id: category.id,
        amountIndex: newAmountIndex,
        historicAmountIndexes: getNewHistoricAmountIndex(
          category,
          newAmountIndex
        ),
      }
    })

    const promises = updatedCategories.map((category) =>
      prisma.teamMemberCategory.update({
        where: { id: category.id },
        data: {
          amountIndex: category.amountIndex,
          historicAmountIndexes: category.historicAmountIndexes,
        },
      })
    )

    await Promise.all(promises)

    console.log('Special categories recalculated')
  } catch (error) {
    console.error(error)
    return null
  }
}

const updateCategory = async (
  id: string,
  data: z.infer<typeof TeamMemberCategorySchema>
) => {
  console.log('Updating category')
  console.log(data.specialCategory)
  const { currentFCA, currentFMR } = await getCurrentIndexes()
  const oldCategory = await prisma.teamMemberCategory.findFirst({
    where: {
      id,
    },
  })

  if (!oldCategory) {
    throw new Error('Category not found')
  }

  const amountIndex = {
    FCA: data.amount / currentFCA,
    FMR: data.amount / currentFMR,
  }

  const newHistoricAmountIndex = getNewHistoricAmountIndex(
    oldCategory,
    amountIndex
  )

  const updatedCategory = {
    name: data.name,
    state: data.state,
    specialCategory: data.specialCategory,
    amountIndex,
    historicAmountIndexes: newHistoricAmountIndex,
  }

  try {
    const updated = await prisma.teamMemberCategory.update({
      where: {
        id,
      },
      data: updatedCategory,
    })
    return updated
  } catch (error) {
    console.log(error)
    return null
  }
}

const getAllCategories = async () =>
  await prisma.teamMemberCategory.findMany({
    where: {
      state: {
        not: false,
      },
    },
  })

const getCategoryById = async (id: string) => {
  await prisma.teamMemberCategory.findMany({
    where: { id },
  })
}

const getObreroCategory = async () => {
  return await prisma.teamMemberCategory.findFirstOrThrow({
    where: { name: 'Obrero' },
  })
}

export {
  getCategoriesForForm,
  getCategories,
  updatePriceCategoryById,
  insertCategory,
  updateCategory,
  deleteCategoryById,
  getAllCategories,
  getCategoryById,
  getObreroCategory,
}
